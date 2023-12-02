import { Pipe, PipeTransform } from '@angular/core';
import { SubCategoria } from '../interfaces/sub-categoria';
import { DataService } from '../services/data.service';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'categoriaNombre',
})
export class CategoriaNombrePipe implements PipeTransform {
  constructor(private service: DataService) {}

  transform(id: number): Observable<string> {
    return this.service.obtenerCategoriaPorId(id).pipe(
      map((categorias: SubCategoria) => {
        return categorias.nombre; // Devuelve el nombre de la primera categoría encontrada
      })
    );
  }
}
