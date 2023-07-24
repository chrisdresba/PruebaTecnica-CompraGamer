import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Categoria } from 'src/app/shared/interfaces/categoria';
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
