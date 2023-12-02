import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-item-categoria',
  templateUrl: './item-categoria.component.html',
  styleUrls: ['./item-categoria.component.scss'],
})
export class ItemCategoriaComponent implements OnInit {
  @Input() categoria: any;

  imagen: string = '';
  urlBase: string = environment.urlBaseImgCategoria;

  constructor(private service: DataService, public router: Router) {}

  ngOnInit(): void {
    this.obtenerURLImagen();
  }

  obtenerURLImagen(): void {
    this.imagen = `${this.urlBase}${this.categoria.imagen}`;
  }

  categoriaPorNombre(nombre: string) {
    const categoria = this.service.reemplazarEspaciosUrl(nombre, 0);
    this.router.navigate([`/productos/${categoria.toLocaleLowerCase()}`]);
  }
}
