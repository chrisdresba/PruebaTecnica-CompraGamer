import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Imagen } from 'src/app/shared/interfaces/producto';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-producto',
  templateUrl: './item-producto.component.html',
  styleUrls: ['./item-producto.component.scss'],
})
export class ItemProductoComponent implements OnInit {
  @Input() producto: any;
  @Input() estado: boolean = false;
  @Output() detalleProducto: EventEmitter<any> = new EventEmitter<any>();
  imagen: string = '';
  urlBase: string = environment.urlBaseImgProducto;

  constructor(
    private service: DataService,
    public serviceCarrito: CarritoService
  ) {}

  ngOnInit(): void {
    this.obtenerURLImagen();
  }

  obtenerURLImagen(): void {
    this.imagen = `${this.urlBase}${this.producto.imagenes[0].nombre}.jpg`;
  }

  async agregarProducto(producto: any) {
    const valor = await this.serviceCarrito.agregarProducto(
      producto,
      this.imagen
    );
    if (valor) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Se agrego el producto al carrito!`,
        showConfirmButton: false,
        timer: 1500,
      });
      // this.serviceCarrito.carritoViewActive();
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error, no hay stock!`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
