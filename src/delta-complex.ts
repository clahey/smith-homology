import { Matrix } from "./matrix";

function count1s32(i: number) {
  i = i - ((i >> 1) & 0x55555555);
  i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
  i = (i + (i >> 4)) & 0x0f0f0f0f;
  i = i + (i >> 8);
  i = i + (i >> 16);
  return i & 0x3f;
}

function set1To0(n: number, j: number) {
  for (let i = 31; i >= 0; i--) {
    const mask = 1 << i;
    if (mask & n) {
      if (j == 0) {
        return n & ~mask;
      } else {
        j--;
      }
    }
  }
  return -1;
}

export function getLens(n: number, k: number = 1) {
  const lens = new DeltaComplex();
  lens.addLens(n, k);
  return lens;
}

export function getBinary(n: number) {
  const binary = new DeltaComplex();
  binary.addBinary(n);
  return binary;
}

export class DeltaComplex {
  dimension: number;
  simplexCount_: number[];
  boundaryMap: number[][][];
  simplexNames: string[][];

  constructor(simplexCount: number[] = [0], boundaryMap: number[][][] = [[]]) {
    this.simplexCount_ = [];
    this.boundaryMap = [];
    this.simplexNames = [];
    this.dimension = Math.max(simplexCount.length - 1, 0);
    for (let dim = 0; dim < this.simplexCount.length; dim++) {
      this.simplexCount_[dim] =
        simplexCount[dim] != undefined ? simplexCount[dim] : 1;
    }
    for (let dim = 0; dim < this.simplexCount.length; dim++) {
      this.boundaryMap[dim] = [];
      for (let simplex = 0; simplex < this.simplexCount(dim); simplex++) {
        this.boundaryMap[dim][simplex] = [];
        for (let boundary = 0; boundary < dim + 1; boundary++) {
          this.boundaryMap[dim][simplex][boundary] =
            ((boundaryMap[dim] || [])[simplex] || [])[boundary] || 0;
        }
      }
    }
  }

  simplexCount(dim: number) {
    if (dim == -1) {
      return 1;
    }
    return this.simplexCount_[dim] || 0;
  }

  getSimplexName(dim: number, index: number): string | undefined {
    return (this.simplexNames[dim] || [])[index];
  }

  setSimplexName(dim: number, index: number, name: string) {
    if (this.simplexNames[dim] === undefined) {
      this.simplexNames[dim] = [];
    }
    this.simplexNames[dim][index] = name;
  }

  getFace(dim: number, index: number, face: number): number {
    return this.boundaryMap[dim][index][face];
  }

  getVertex(dim: number, index: number, vertex: number): number {
    if (vertex > 0) {
      return this.getVertex(dim - 1, this.getFace(dim, index, 0), vertex - 1);
    }
    if (dim > 0) {
      return this.getVertex(dim - 1, this.getFace(dim, index, 1), 0);
    } else {
      return index;
    }
  }

  getBoundaryMatrix(dim: number): Matrix {
    const retval = new Matrix(
      [],
      this.simplexCount(dim - 1),
      this.simplexCount(dim)
    );
    for (let simplex = 0; simplex < this.simplexCount(dim); simplex++) {
      for (let boundary = 0; boundary < dim + 1; boundary++) {
        retval.data[simplex][this.boundaryMap[dim][simplex][boundary]] +=
          boundary % 2 ? -1 : 1;
      }
    }
    return retval;
  }

  getHomology(dim: number) {
    let rank = this.simplexCount(dim);
    const torsion = [];
    const boundaryMatrix = this.getBoundaryMatrix(dim);
    const imageMatrix = this.getBoundaryMatrix(dim + 1);
    boundaryMatrix.snf();
    imageMatrix.snf();
    for (
      let i = 0;
      i < Math.min(boundaryMatrix.width, boundaryMatrix.height);
      i++
    ) {
      if (boundaryMatrix.data[i][i] != 0) {
        rank--;
      }
    }
    for (let i = 0; i < Math.min(imageMatrix.width, imageMatrix.height); i++) {
      if (imageMatrix.data[i][i] != 0) {
        rank--;
        if (imageMatrix.data[i][i] != 1) {
          torsion.push(imageMatrix.data[i][i]);
        }
      }
    }
    if (dim == 0) {
      rank += 1;
    }
    return { rank, torsion };
  }

  addSimplex(dim: number, name: string = undefined) {
    const simplexIndices: number[] = [];
    simplexIndices[0] = 0;
    let i;
    for (i = 1; ; i++) {
      const simDim = count1s32(i) - 1;
      simplexIndices[i] = this.simplexCount(simDim);
      this.simplexCount_[simDim] = this.simplexCount(simDim) + 1;
      if (simDim == dim) {
        break;
      }
    }
    const count = i;
    for (i = 1; i < count + 1; i++) {
      const simDim = count1s32(i) - 1;
      const simInd = simplexIndices[i];
      if (!this.boundaryMap[simDim]) {
        this.boundaryMap[simDim] = [];
      }
      // assert(this.boundaryMap[simDim].length = simplexIndices[i];
      this.boundaryMap[simDim][simInd] = [];
      for (let j = 0; j < simDim + 1; j++) {
        this.boundaryMap[simDim][simInd][j] = simplexIndices[set1To0(i, j)];
      }
    }
    if (dim > this.dimension) {
      this.dimension = dim;
    }
    this.setSimplexName(dim, this.simplexCount(dim) - 1, name);
  }

  mergeSimplices(
    dim: number,
    src: number,
    dest: number,
    srcFace: number = undefined,
    destFace: number = undefined
  ) {
    if (dim == 3) {
      console.log(dim, src, dest, srcFace, destFace);
    }
    if (srcFace !== undefined && destFace !== undefined) {
      src = this.boundaryMap[dim][src][srcFace];
      dest = this.boundaryMap[dim][dest][destFace];
      dim = dim - 1;
    }
    if (src == dest) {
      return;
    }
    if (dim == -1) {
      return;
    }
    for (let i = 0; i < dim + 1; i++) {
      this.mergeSimplices(dim, src, dest, i, i);
    }
    this.simplexCount_[dim] = this.simplexCount(dim) - 1;
    this.boundaryMap[dim].splice(dest, 1);
    for (const simplex of this.boundaryMap[dim + 1]) {
      for (let i = 0; i < dim + 2; i++) {
        // Note that if src > dest, these may both trigger.
        if (simplex[i] == dest) {
          simplex[i] = src;
        }
        if (simplex[i] > dest) {
          simplex[i]--;
        }
      }
    }
  }

  copyData() {
    const simplexCount = this.simplexCount_.slice();
    const boundaryMap = this.boundaryMap.map(dimension =>
      dimension.map(boundary => boundary.slice())
    );
    const dimension = this.dimension;
    return { simplexCount, boundaryMap, dimension };
  }

  addLens(n: number, k: number = 1) {
    const o = this.simplexCount(3);
    for (let i = 0; i < n; i++) {
      this.addSimplex(3);
    }
    for (let i = 0; i < n; i++) {
      this.mergeSimplices(3, i + o, ((i + k) % n) + o, 0, 1);
      this.mergeSimplices(3, i + o, ((i + 1) % n) + o, 2, 3);
    }
  }

  addBinary(n: number) {
    const o = this.simplexCount(2);
    this.addSimplex(2);
    this.mergeSimplices(2, o, o, 0, 1);
    this.mergeSimplices(2, o, o, 0, 2);
    for (let i = 0; i < n; i++) {
      this.addSimplex(2);
      this.mergeSimplices(2, o + i, o + i + 1, 0, 1);
      this.mergeSimplices(2, o + i + 1, o + i + 1, 0, 2);
    }
  }

  addSingularity(dim: number) {
    const o = this.simplexCount(dim);
    this.addSimplex(dim);
    for (let i = 0; i < dim; i++) {
      this.mergeSimplices(dim, o, o, i, i + 1);
    }
  }
}
