import { Component, OnInit, Input } from "@angular/core";
import { DeltaComplex } from "../../delta-complex";

@Component({
  selector: "app-two-simplex",
  templateUrl: "./two-simplex.component.html",
  styleUrls: ["./two-simplex.component.css"]
})
export class TwoSimplexComponent implements OnInit {
  @Input() complex: DeltaComplex;
  @Input() index: number;
  name: string;
  faces: string[];
  vertices: string[];

  readonly dimension = 2;

  constructor() {}

  ngOnInit() {
    this.name =
      this.complex.getSimplexName(this.dimension, this.index) ||
      `(${this.dimension},${this.index})`;
    this.faces = this.range(this.dimension + 1)
      .map(face => this.complex.getFace(this.dimension, this.index, face))
      .map(
        face =>
          this.complex.getSimplexName(this.dimension - 1, face) || `(${this.dimension - 1}, ${face})`
      );
    this.vertices = this.range(this.dimension + 1)
      .map(vertex =>this.complex.getVertex(this.dimension, this.index, vertex))
      .map(
        vertex =>
          this.complex.getSimplexName(0, vertex) ||
          `(${vertex})`
      );
  }

  range(n) {
    const range = [];
    for (let i = 0; i<n;i++) {
      range[i]=i;
    }
    return range;
  }
}
