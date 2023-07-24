import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Imagen } from 'src/app/shared/interfaces/producto';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environment/environment';

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

  constructor(private service: DataService) {}

  ngOnInit(): void {
    this.obtenerURLImagen();
  }

  obtenerURLImagen(): void {
    this.imagen = `${this.urlBase}${this.producto.imagenes[0].nombre}-med.jpg`;
  }

  agregarProducto(producto: any) {
    this.service.agregarCarrito(producto);
  }

  detalle(producto: any) {
    this.detalleProducto.emit(producto);
  }
}
