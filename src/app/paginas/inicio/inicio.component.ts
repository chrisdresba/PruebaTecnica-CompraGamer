import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/shared/interfaces/categoria';
import { Producto } from 'src/app/shared/interfaces/producto';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  arrayProductos: Producto[] = [];
  arrayCategorias: Categoria[] = [];

  constructor(public service: DataService, public routes: Router) {}

  ngOnInit(): void {
    this.service.obtenerProductosDestacados().subscribe((productos) => {
      this.arrayProductos = productos;
    });

    this.service.obtenerSubcategorias().subscribe((categorias) => {
      this.arrayCategorias = categorias;
    });
  }
}
