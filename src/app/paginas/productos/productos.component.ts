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
  categoriaId?: number | null;
  arrayProductos: Producto[] = [];
  arrayCategorias: SubCategoria[] = [];

  constructor(
    public service: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.categoriaId = id ? +id : null; // Convierte el valor a número o establece 'null' si no hay ID
      this.filtrarProductosPorCategoria(this.categoriaId);
    });

    this.service.obtenerSubcategorias().subscribe((categorias) => {
      this.arrayCategorias = categorias;
    });
  }

  filtrarProductosPorCategoria(id: number | null): void {
    try {
      if (id == null) {
        this.service.obtenerProductos().subscribe((productos) => {
          this.arrayProductos = productos;
        });
      } else {
        // Filtrar los productos por categoría si se proporcionó un ID
        this.service
          .obtenerProductosPorCategoria(id as number)
          .subscribe((productos) => {
            this.arrayProductos = productos;
          });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
