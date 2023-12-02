import { Injectable } from '@angular/core';
import { Carrito, CarritoItem } from '../interfaces/carrito';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Subject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  public carrito: Carrito = { items: [], total: 0, id: '' };
  public carritoItemCountSubject = new BehaviorSubject<number>(0);
  public carritoView = new Subject<boolean>();
  public idUsuario: string = '';
  public productoStock: number = 0;

  get carritoItemCount$() {
    return this.carritoItemCountSubject.asObservable();
  }

  constructor(public service: DataService) {
    const carritoJson = localStorage.getItem('carrito');
    if (carritoJson) {
      this.carrito = JSON.parse(carritoJson);
      this.actualizarContadorCarrito();
    }

    const usuario = localStorage.getItem('sesionUsuario');
    if (usuario) {
      this.idUsuario = usuario;
    }
  }

  carritoViewActive() {
    this.carritoView.next(true);
  }

  carritoViewInactive() {
    this.carritoView.next(false);
  }

  async agregarProducto(producto: any, imagen: string): Promise<boolean> {
    try {
      const itemIndex = this.carrito.items.findIndex(
        (item) => item.id_producto === producto.id_producto
      );

      if (itemIndex !== -1) {
        this.productoStock = await this.service.obtenerStockProductoId(
          producto.id_producto
        );

        if (this.carrito.items[itemIndex].cantidad < this.productoStock) {
          // Si el producto ya existe en el carrito, actualiza la cantidad y el total, si es que se dispone de stock.
          this.carrito.items[itemIndex].cantidad += 1;
          this.carrito.items[itemIndex].total += producto.precio;
        } else {
          return false;
        }
      } else {
        // Si el producto no existe en el carrito, agregar un nuevo item
        const item: CarritoItem = {
          producto: producto.nombre,
          id_producto: producto.id_producto,
          precio: producto.precio,
          cantidad: 1,
          total: producto.precio,
          imagen: imagen,
          id_carrito: uuidv4(),
          id_usuario: this.idUsuario,
        };
        this.carrito.items.push(item);
      }
      this.carrito.total += producto.precio;
      this.actualizarContadorCarrito();

      // Convertir el carrito a JSON y almacenarlo en el localStorage
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  actualizarContadorCarrito() {
    const itemCount = this.carrito.items.reduce(
      (total, item) => total + item.cantidad,
      0
    );
    this.carritoItemCountSubject.next(itemCount);
    this.obtenerCarrito();
  }

  eliminarProducto(id_producto: number): boolean {
    try {
      const itemIndex = this.carrito.items.findIndex(
        (item) => item.id_producto === id_producto
      );

      if (itemIndex !== -1) {
        const item = this.carrito.items[itemIndex];
        this.carrito.total -= item.total;
        this.carrito.items.splice(itemIndex, 1);
        this.actualizarContadorCarrito();

        // Convertir el carrito a JSON y almacenarlo en el localStorage
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        return true;
      } else {
        return false; // El producto no existe en el carrito, no se pudo eliminar.
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async actualizarCantidadProducto(
    producto: any,
    cantidad: number
  ): Promise<boolean> {
    try {
      const itemIndex = this.carrito.items.findIndex(
        (item) => item.id_producto === producto.id_producto
      );

      if (itemIndex !== -1) {
        this.productoStock = await this.service.obtenerStockProductoId(
          producto.id_producto
        );

        if (
          this.carrito.items[itemIndex].cantidad >= this.productoStock &&
          cantidad == 1
        ) {
          return false; // No hay suficiente stock para agregar esa cantidad.
        }

        const productoEnCarrito = this.carrito.items[itemIndex];

        this.carrito.items[itemIndex].cantidad += cantidad;
        this.carrito.items[itemIndex].total =
          this.carrito.items[itemIndex].cantidad * productoEnCarrito.precio;

        if (cantidad == -1) {
          this.carrito.total -= productoEnCarrito.precio;
        } else {
          this.carrito.total += productoEnCarrito.precio;
        }

        this.actualizarContadorCarrito();

        // Convertir el carrito a JSON y almacenarlo en el localStorage
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        return true;
      } else {
        return false; // El producto no existe en el carrito, no se pudo actualizar la cantidad.
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  obtenerCarrito(): Carrito {
    return this.carrito;
  }
}
