import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MatrixComponent } from './matrix/matrix.component';
import { SimplexComponent } from './simplex/simplex.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent, MatrixComponent, SimplexComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
