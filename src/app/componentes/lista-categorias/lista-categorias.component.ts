import { Component, Input, OnInit } from '@angular/core';
import { SubCategoria } from 'src/app/shared/interfaces/sub-categoria';

@Component({
  selector: 'app-lista-categorias',
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.scss'],
})
export class ListaCategoriasComponent implements OnInit {
  @Input() arrayCategorias: SubCategoria[] = [];

  constructor() {}

  ngOnInit() {}
}
