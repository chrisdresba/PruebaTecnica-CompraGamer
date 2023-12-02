import { Component, Input } from '@angular/core';
import { Producto } from 'src/app/shared/interfaces/producto';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss'],
})
export class ListaProductosComponent {
  @Input() arrayProductos: any;

  constructor(private service: DataService) {}

  ngOnInit(): void {}
}
