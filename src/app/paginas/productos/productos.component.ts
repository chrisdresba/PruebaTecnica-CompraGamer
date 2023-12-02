import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/shared/interfaces/categoria';
import { Producto } from 'src/app/shared/interfaces/producto';
import { SubCategoria } from 'src/app/shared/interfaces/sub-categoria';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  categoriaNombre: string | null = null;
  arrayProductos: Producto[] = [];
  arrayCategorias: SubCategoria[] = [];

  constructor(
    public service: DataService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    try {
      this.activatedRoute.paramMap.subscribe((params) => {
        const categoria = params.get('nombre') || '';
        const nombre = this.service.reemplazarEspaciosUrl(categoria, 1);
        const valor = this.obtenerValorBusqueda(nombre);
        if (valor == null) {
          this.categoriaNombre = nombre ? nombre : null; // Convierte el valor a número o establece 'null' si no hay ID
          this.filtrarProductosPorCategoria(this.categoriaNombre);
        } else {
          this.service
            .obtenerProductoPorNombre(valor || '')
            .subscribe((productos) => {
              this.arrayProductos = productos;
            });
        }
      });

      this.service.obtenerSubcategorias().subscribe((categorias) => {
        this.arrayCategorias = categorias;
        this.arrayCategorias.sort((a, b) => {
          const nombreA = a.nombre.toLowerCase();
          const nombreB = b.nombre.toLowerCase();
          return nombreA.localeCompare(nombreB);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  filtrarProductosPorCategoria(nombre: string | null): void {
    try {
      if (nombre == null || nombre == '') {
        this.service.obtenerProductos().subscribe((productos) => {
          this.arrayProductos = productos;
        });
      } else {
        // Filtrar los productos por categoría si se proporcionó un ID
        this.service
          .obtenerProductosPorSubcategoria(nombre)
          .subscribe((productos) => {
            this.arrayProductos = productos;
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  obtenerValorBusqueda(texto: string): string | null {
    const patron = /^buscar=(.*)/; // Expresión regular para buscar "buscar=" al principio del string

    const coincidencias = texto.match(patron);

    if (coincidencias && coincidencias.length === 2) {
      return coincidencias[1];
    } else {
      return null;
    }
  }
}
