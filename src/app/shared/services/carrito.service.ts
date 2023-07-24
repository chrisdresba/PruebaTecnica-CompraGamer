import { Injectable } from '@angular/core';
import { Carrito, CarritoItem } from '../interfaces/carrito';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  public carrito: Carrito = { items: [], total: 0, id: '' };
  public carritoItemCountSubject = new BehaviorSubject<number>(0);
  public idUsuario: string = '';

  get carritoItemCount$() {
    return this.carritoItemCountSubject.asObservable();
  }
  constructor() {
    const carritoJson = localStorage.getItem('carrito');
    if (carritoJson) {
      this.carrito = JSON.parse(carritoJson);
      this.actualizarContadorCarrito();
    }

    const usuario = localStorage.getItem('sesionUsuario');
    if (usuario) {
      const sesionUsuario: Usuario = JSON.parse(usuario);
      this.idUsuario = sesionUsuario.id;
    }
  }

  agregarProducto(producto: any, imagen: string) {
    try {
      const itemIndex = this.carrito.items.findIndex(
        (item) => item.id_producto === producto.id_producto
      );

      if (itemIndex !== -1) {
        // Si el producto ya existe en el carrito, actualiza la cantidad y el total
        this.carrito.items[itemIndex].cantidad += 1;
        this.carrito.items[itemIndex].total += producto.precio;
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
    } catch (error) {
      console.error(error);
    }
  }

  actualizarContadorCarrito() {
    const itemCount = this.carrito.items.reduce(
      (total, item) => total + item.cantidad,
      0
    );
    this.carritoItemCountSubject.next(itemCount);
  }
}
