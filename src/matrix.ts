export function extendedGcd(
  a: number,
  b: number
): { gcd: number; aMultiplier: number; bMultiplier: number } {
  const accumulators = new Matrix([[a, 1, 0], [b, 0, 1]]);
  while (Math.abs(accumulators.data[1][0]) > 0.5) {
    const divisor = Math.trunc(
      accumulators.data[0][0] / accumulators.data[1][0]
    );
    accumulators.addRow(1, 0, -divisor);
    accumulators.swapRows(0, 1);
  }
  return {
    gcd: accumulators.data[0][0],
    aMultiplier: accumulators.data[0][1],
    bMultiplier: accumulators.data[0][2]
  };
}

export class Matrix {
  data: number[][];
  width: number;
  height: number;

  constructor(
    values: number[][],
    width: number = undefined,
    height: number = undefined
  ) {
    this.height = height == undefined ? values.length : height;
    this.width = width == undefined ? values[0].length : width;
    this.data = [];
    for (let i = 0; i < this.height; i++) {
      this.data[i] = [];
      for (let j = 0; j < this.width; j++) {
        this.data[i][j] = (values[i] || [])[j] || 0;
      }
    }
  }

  copyData() {
    const data = [];
    for (let i = 0; i < this.height; i++) {
      data[i] = this.data[i].slice();
    }
    return data;
  }

  multiplyRow(src, multiplier) {
    this.addRow(src, src, multiplier - 1);
  }

  multiplyCol(src, multiplier) {
    this.addCol(src, src, multiplier - 1);
  }

  swapRows(src, dest) {
    if (src == dest) {
      return;
    }
    const temp = this.data[dest];
    this.data[dest] = this.data[src];
    this.data[src] = temp;
  }

  swapCols(src, dest) {
    if (src == dest) {
      return;
    }
    for (let i = 0; i < this.height; i++) {
      const temp = this.data[i][dest];
      this.data[i][dest] = this.data[i][src];
      this.data[i][src] = temp;
    }
  }

  addRow(src: number, dest: number, multiplier = 1) {
    for (let i = 0; i < this.width; i++) {
      this.data[dest][i] += this.data[src][i] * multiplier;
    }
  }

  addCol(src: number, dest: number, multiplier = 1) {
    for (let i = 0; i < this.height; i++) {
      this.data[i][dest] += this.data[i][src] * multiplier;
    }
  }

  combineRows(src: number, dest: number, multiplier: Matrix) {
    for (let i = 0; i < this.width; i++) {
      const srcValue = this.data[src][i];
      const destValue = this.data[dest][i];
      this.data[src][i] =
        multiplier.data[0][0] * srcValue + multiplier.data[0][1] * destValue;
      this.data[dest][i] =
        multiplier.data[1][0] * srcValue + multiplier.data[1][1] * destValue;
    }
  }

  combineCols(src: number, dest: number, multiplier: Matrix) {
    for (let i = 0; i < this.height; i++) {
      const srcValue = this.data[i][src];
      const destValue = this.data[i][dest];
      this.data[i][src] =
        multiplier.data[0][0] * srcValue + multiplier.data[1][0] * destValue;
      this.data[i][dest] =
        multiplier.data[0][1] * srcValue + multiplier.data[1][1] * destValue;
    }
  }

  gcdRows(src: number, dest: number, controlCol: number) {
    if (this.data[src][controlCol] < 0) {
      this.multiplyRow(src, -1);
    }
    if (this.data[dest][controlCol] < 0) {
      this.multiplyRow(dest, -1);
    }
    const srcControl = this.data[src][controlCol];
    const destControl = this.data[dest][controlCol];
    if (destControl == 0) {
      return;
    }
    if (destControl % srcControl == 0) {
      this.addRow(src, dest, -(destControl / srcControl));
      return;
    }

    const {
      gcd,
      aMultiplier: srcMultiplier,
      bMultiplier: destMultiplier
    } = extendedGcd(srcControl, destControl);
    const multiplier = new Matrix([
      [srcMultiplier, destMultiplier],
      [-destControl / gcd, srcControl / gcd]
    ]);
    this.combineRows(src, dest, multiplier);
  }

  gcdCols(src: number, dest: number, controlRow: number) {
    if (this.data[controlRow][src] < 0) {
      this.multiplyCol(src, -1);
    }
    if (this.data[controlRow][dest] < 0) {
      this.multiplyCol(dest, -1);
    }
    const srcControl = this.data[controlRow][src];
    const destControl = this.data[controlRow][dest];
    if (destControl == 0) {
      return;
    }
    if (destControl % srcControl == 0) {
      this.addCol(src, dest, -(destControl / srcControl));
      return;
    }

    const {
      gcd,
      aMultiplier: srcMultiplier,
      bMultiplier: destMultiplier
    } = extendedGcd(srcControl, destControl);
    const multiplier = new Matrix([
      [srcMultiplier, -destControl / gcd],
      [destMultiplier, srcControl / gcd]
    ]);
    this.combineCols(src, dest, multiplier);
  }

  pivotRows(row: number, col: number) {
    for (let i = row + 1; i < this.height; i++) {
      this.gcdRows(row, i, col);
    }
  }

  pivotCols(row: number, col: number) {
    for (let i = col + 1; i < this.width; i++) {
      this.gcdCols(col, i, row);
    }
  }

  pivot(row: number, col: number) {
    let oldValue = 0;
    while (oldValue != this.data[row][col]) {
      oldValue = this.data[row][col];
      this.pivotRows(row, col);
      this.pivotCols(row, col);
    }
    this.pivotRows(row, col);
  }

  findPivot(row: number, col: number) {
    for (let j = col; j < this.width; j++) {
      for (let i = row; i < this.height; i++) {
        if (this.data[i][j] != 0) {
          this.swapRows(row, i);
          this.swapCols(col, j);
          return;
        }
      }
    }
  }

  diagonalize() {
    for (let i = 0; i < Math.min(this.width, this.height); i++) {
      this.findPivot(i, i);
      if (this.data[i][i] == 0) {
        return;
      }
      this.pivot(i, i);
    }
  }

  snfFixup() {
    let i = 0;
    while (i < Math.min(this.width, this.height) - 1) {
        const thisValue = this.data[i][i];
        const nextValue = this.data[i+1][i+1];
      if (nextValue == 0) {
        return;
      }
      if (nextValue % thisValue != 0) {
        this.addRow(i + 1, i);
        this.pivot(i, i);
        i--;
      } else {
        i++;
      }
    }
  }

  snf() {
    this.diagonalize();
    this.snfFixup();
  }
}
