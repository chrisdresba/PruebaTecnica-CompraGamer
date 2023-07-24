import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/shared/services/carrito.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public vistaCategorias: boolean = false;
  contador: number = 0;
  constructor(public router: Router, public service: CarritoService) {}

  ngOnInit(): void {
    this.service.carritoItemCount$.subscribe((count) => {
      this.contador = count;
    });
  }
  verCategorias() {
    this.vistaCategorias = !this.vistaCategorias;
    console.log(this.vistaCategorias);
  }
}
