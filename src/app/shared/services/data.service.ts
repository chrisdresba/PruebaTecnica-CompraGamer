import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Producto } from '../interfaces/producto';
import { SubCategoria } from '../interfaces/sub-categoria';
import { map } from 'rxjs/operators';
import { Categoria } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    const url = `${this.apiUrl}/productos.json`;
    return this.http.get<Producto[]>(url);
  }

  obtenerProductosDestacados(): Observable<Producto[]> {
    return this.obtenerProductos().pipe(
      map((productos: Producto[]) =>
        productos.filter((producto) => producto.destacado > 0)
      )
    );
  }

  obtenerProductosPorCategoria(id: number): Observable<Producto[]> {
    return this.obtenerProductos().pipe(
      map((productos: Producto[]) =>
        productos.filter((producto) => producto.id_subcategoria == id)
      )
    );
  }

  obtenerSubcategorias(): Observable<SubCategoria[]> {
    const url = `${this.apiUrl}/subcategorias.json`;
    return this.http.get<SubCategoria[]>(url);
  }

  agregarCarrito(item: Producto) {}
}
