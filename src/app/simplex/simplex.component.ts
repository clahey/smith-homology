import { Component, OnChanges, Input } from "@angular/core";
import { DeltaComplex } from "../../delta-complex";

@Component({
  selector: "app-simplex",
  templateUrl: "./simplex.component.html",
  styleUrls: ["./simplex.component.css"]
})
export class SimplexComponent implements OnChanges {
  @Input() complex: DeltaComplex;
  @Input() dimension: number;
  @Input() index: number;
  name: string;
  faces: string[];
  vertices: string[];

  constructor() {}

  ngOnChanges() {
    this.name =
      this.complex.getSimplexName(this.dimension, this.index) ||
      `(${this.index})`;
    console.log(this.name);
    this.faces = this.range(this.dimension + 1)
      .map(face => this.complex.getFace(this.dimension, this.index, face))
      .map(
        face =>
          this.complex.getSimplexName(this.dimension - 1, face) || `(${face})`
      );
    this.vertices = this.range(this.dimension + 1)
      .map(vertex => this.complex.getVertex(this.dimension, this.index, vertex))
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
