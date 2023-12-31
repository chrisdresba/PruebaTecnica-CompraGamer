import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class MaterialModule {}
