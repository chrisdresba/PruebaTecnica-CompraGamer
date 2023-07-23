import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { AccesoComponent } from './paginas/acceso/acceso.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { Error404Component } from './paginas/error404/error404.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
  },
  {
    path: 'ingresar',
    component: AccesoComponent,
  },
  {
    path: 'carrito',
    component: CarritoComponent,
  },
  {
    path: '**',
    component: Error404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
