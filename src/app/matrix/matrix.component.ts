import { Component, OnInit, Input } from '@angular/core';
import { Matrix } from '../../matrix';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {

  @Input() matrix: Matrix;
  columns: string;

  constructor() { }

  ngOnInit() {
    this.columns = "auto ".repeat(this.matrix.width);
  }

}