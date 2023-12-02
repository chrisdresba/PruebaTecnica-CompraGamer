import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Producto } from '../interfaces/producto';
import { SubCategoria } from '../interfaces/sub-categoria';
import { map } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Categoria } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl;
  public firestore: Firestore = inject(Firestore);
  public categorias: Categoria[] = [];
  public subcategorias: SubCategoria[] = [];

  constructor(private http: HttpClient) {
    this.obtenerSubcategorias().subscribe((subcategorias) => {
      this.subcategorias = subcategorias;
    });
    this.obtenerCategorias().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  obtenerProductos(): Observable<Producto[]> {
    try {
      const url = `${this.apiUrl}/api/productos`;
      return this.http.get<Producto[]>(url);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return of([]);
    }
  }

  obtenerProductosDestacados(): Observable<Producto[]> {
    try {
      return this.obtenerProductos().pipe(
        map((productos: Producto[]) =>
          productos.filter((producto) => producto.destacado > 0)
        )
      );
    } catch (error) {
      console.error('Error al obtener los productos destacados:', error);
      return of([]);
    }
  }

  obtenerProductoPorNombre(nombre: string): Observable<Producto[]> {
    try {
      const url = `${this.apiUrl}/api/buscar/${nombre.toLowerCase()}`;
      return this.http.get<Producto[]>(url);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return of([]);
    }
  }

  async obtenerStockProductoId(id: number): Promise<number> {
    try {
      const productos: Producto[] | undefined =
        await this.obtenerProductos().toPromise();

      if (!Array.isArray(productos)) {
        throw new Error('La respuesta no es un arreglo de productos.');
      }

      const productoEncontrado = productos.find(
        (producto) => producto.id_producto === id
      );
      return productoEncontrado ? productoEncontrado.stock : 0;
    } catch (error) {
      console.error('Error al obtener el stock del producto:', error);
      return 0;
    }
  }

  obtenerProductosPorSubcategoria(nombre: string): Observable<Producto[]> {
    try {
      const url = `${
        this.apiUrl
      }/api/productos/subcategorias/${nombre.toLowerCase()}`;
      return this.http.get<Producto[]>(url);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return of([]);
    }
  }

  obtenerSubcategorias(): Observable<SubCategoria[]> {
    try {
      const url = `${this.apiUrl}/api/subcategorias`;
      return this.http.get<SubCategoria[]>(url);
    } catch (error) {
      console.error('Error al obtener las subcategorías:', error);
      return of([]);
    }
  }

  obtenerCategorias(): Observable<Categoria[]> {
    try {
      const url = `${this.apiUrl}/api/categorias`;
      return this.http.get<Categoria[]>(url);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      return of([]);
    }
  }

  obtenerCategoriaPorId(id: number): Observable<SubCategoria> {
    try {
      const url = `${this.apiUrl}/api/subcategorias/${id}`;
      return this.http.get<SubCategoria>(url);
    } catch (error) {
      console.error('Error al obtener la categoría:', error);
      return of({} as SubCategoria);
    }
  }

  obtenerCategoriaPorNombre(nombre: string): Observable<SubCategoria[]> {
    return this.obtenerSubcategorias().pipe(
      map((categorias: SubCategoria[]) =>
        categorias.filter((categoria) =>
          categoria.nombre.toLowerCase().includes(nombre.toLowerCase())
        )
      )
    );
  }

  reemplazarEspaciosUrl(texto: string, orden: number): string {
    if (orden == 0) {
      return texto.replace(/\s+/g, '-').replace(/-$/, '');
    } else {
      return texto.replace(/-/g, ' ');
    }
  }
}
