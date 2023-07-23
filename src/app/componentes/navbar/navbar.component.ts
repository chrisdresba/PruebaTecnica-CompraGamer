import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  public vistaCategorias: boolean = false;
  constructor(public router: Router) {}

  verCategorias() {
    this.vistaCategorias = !this.vistaCategorias;
    console.log(this.vistaCategorias);
  }
}
