import { Component, VERSION } from "@angular/core";
import { Matrix } from "../matrix";
import { DeltaComplex, getLens } from "../delta-complex";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  matrix: Matrix;
  columns: string;
  test: any;
  d3: Matrix;
  d2: Matrix;
  d1: Matrix;
  d0: Matrix;
  complex: DeltaComplex;
  h0;
  h1;
  h2;
  h3;
  indices: number[];

  constructor() {
    // this.matrix = new Matrix([[0, 25], [10, 0]]);
    // this.d0 = new Matrix([[1], [1]]);
    // this.d1 = new Matrix([[0, 0], [0, 0], [1, -1], [1, -1], [1, -1]]);
    // this.d2 = new Matrix([
    //   [1, 0, -1, 1, 0],
    //   [1, 0, 0, -1, 1],
    //   [1, 0, 1, 0, -1],
    //   [0, 1, -1, 1, 0],
    //   [0, 1, 0, -1, 1],
    //   [0, 1, 1, 0, -1]
    // ]);
    // this.d3 = new Matrix([
    //   [-1, 1, 0, -1, 1, 0],
    //   [0, -1, 1, 0, -1, 1],
    //   [1, 0, -1, 1, 0, -1]
    // ]);
    // this.d0.snf();
    // this.d1.snf();
    // this.d2.snf();
    // this.d3.snf();

    // this.complex = new DeltaComplex(
    //   [2, 6, 8, 4],
    //   [
    //     [[0], [0]],
    //     [[0, 0], [1, 1], [1, 0], [1, 0], [1, 0], [1, 0]],
    //     [[3, 2, 0], [4, 3, 0], [5, 4, 0], [2, 5, 0], [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 2, 5]],
    //     [[5, 4, 1, 0], [6, 5, 2, 1], [7, 6, 3, 2], [4, 7, 0, 3]]
    //   ]
    // );
    // this.complex = new DeltaComplex([],[]);
    // this.complex.addSimplex(3);
    // this.complex.addSimplex(3);
    // this.complex.addSimplex(3);
    // this.complex.addSimplex(3);
    // this.complex.addSimplex(3);
    // this.complex.mergeSimplices(3, 0, 1, 0, 1);
    // this.complex.mergeSimplices(3, 1, 2, 0, 1);
    // this.complex.mergeSimplices(3, 2, 3, 0, 1);
    // this.complex.mergeSimplices(3, 3, 4, 0, 1);
    // this.complex.mergeSimplices(3, 4, 0, 0, 1);
    // this.complex.mergeSimplices(3, 0, 1, 2, 3);
    // this.complex.mergeSimplices(3, 1, 2, 2, 3);
    // this.complex.mergeSimplices(3, 2, 3, 2, 3);
    // this.complex.mergeSimplices(3, 3, 4, 2, 3);
    // this.complex.mergeSimplices(3, 4, 0, 2, 3);
    this.complex = getLens(3, 1);
    // this.complex = new DeltaComplex;
    // this.complex.addSimplex(2);
    // this.complex.addSimplex(2);
    // this.complex.mergeSimplices(2, 0, 1, 1, 1)
    // this.complex.mergeSimplices(2, 0, 1, 0, 2)
    // this.complex.mergeSimplices(2, 0, 1, 2, 0)
    for (let i = 0; i < 3; i++) {
      this.complex.setSimplexName(3, i, `V${i + 1}`);
      this.complex.setSimplexName(
        2,
        this.complex.getFace(3, i, 0),
        `I${i + 1}`
      );
    }
    this.complex.setSimplexName(2, this.complex.getFace(3, 0, 2), "O1");
    this.complex.setSimplexName(2, this.complex.getFace(3, 1, 2), "O2");
    this.complex.setSimplexName(2, this.complex.getFace(3, 2, 2), "O3");
    this.complex.setSimplexName(0, this.complex.getVertex(3, 0, 0), "O");
    this.complex.setSimplexName(0, this.complex.getVertex(3, 0, 3), "I");
    this.complex.setSimplexName(
      1,
      this.complex.getFace(2, this.complex.getFace(3, 0, 0), 0),
      "i"
    );
    this.complex.setSimplexName(
      1,
      this.complex.getFace(2, this.complex.getFace(3, 0, 3), 2),
      "o"
    );
    this.complex.setSimplexName(
      1,
      this.complex.getFace(2, this.complex.getFace(3, 0, 1), 1),
      "a1"
    );
    this.complex.setSimplexName(
      1,
      this.complex.getFace(2, this.complex.getFace(3, 1, 1), 1),
      "a2"
    );
    this.complex.setSimplexName(
      1,
      this.complex.getFace(2, this.complex.getFace(3, 2, 1), 1),
      "a3"
    );
    this.h0 = this.complex.getHomology(0);
    this.h1 = this.complex.getHomology(1);
    this.h2 = this.complex.getHomology(2);
    this.h3 = this.complex.getHomology(3);
    this.indices = this.range(1);
    this.indices = [0];
    console.log(this.h1);
  }

  range(n) {
    const range = [];
    for (let i = 0; i < n; i++) {
      range[i] = i;
    }
    return range;
  }
}
