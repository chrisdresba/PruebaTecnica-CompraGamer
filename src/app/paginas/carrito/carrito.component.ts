import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Carrito } from 'src/app/shared/interfaces/carrito';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit {
  public carrito?: Carrito;
  sesion: boolean = false;

  constructor(
    public service: CarritoService,
    public auth: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.verCarrito();
    this.auth.sesion$.subscribe((sesion) => {
      this.sesion = sesion;
    });
  }

  verCarrito() {
    this.carrito = this.service.obtenerCarrito();
  }

  procesarCompra() {
    if (this.sesion) {
      Swal.fire({
        title: 'La operación está en desarrollo',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
    } else {
      Swal.fire({
        title: 'Inicia sesión para continuar',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate([`/ingresar`]);
        }
      });
    }
  }

  restarCantidadProducto(item: any) {
    if (item.cantidad > 1) {
      this.service.actualizarCantidadProducto(item, -1);
      this.verCarrito();
    } else {
      this.service.eliminarProducto(item.id_producto);
      if (this.carrito?.items.length === 0) {
        this.limpiarCarrito();
      } else {
        this.verCarrito();
      }
    }
  }

  async agregarCantidadProducto(item: any) {
    try {
      let response = await this.service.actualizarCantidadProducto(item, 1);
      if (!response) {
        Swal.fire({
          title: 'No hay más stock de este producto',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // this.verCarrito();
      }
    } catch (error) {
      console.error(error);
    }
  }

  limpiarCarrito() {
    this.verCarrito();
    this.carrito = undefined;
    localStorage.removeItem('carrito');
    this.service.carrito = { items: [], total: 0, id: '' };
    this.service.actualizarContadorCarrito();
    this.router.navigate([`/productos`]);
  }
}
