import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda',
})
export class MonedaPipe implements PipeTransform {
  transform(value: number): string {
    const numeroFormateado = value
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return '$' + numeroFormateado;
  }
}
