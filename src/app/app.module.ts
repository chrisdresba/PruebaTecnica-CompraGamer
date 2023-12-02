import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { AccesoComponent } from './paginas/acceso/acceso.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { Error404Component } from './paginas/error404/error404.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { ItemProductoComponent } from './componentes/item-producto/item-producto.component';
import { ListaProductosComponent } from './componentes/lista-productos/lista-productos.component';
import { ListaCategoriasComponent } from './componentes/lista-categorias/lista-categorias.component';
import { ItemCategoriaComponent } from './componentes/item-categoria/item-categoria.component';
import { ProductosComponent } from './paginas/productos/productos.component';
import { CategoriaNombrePipe } from './shared/pipes/categoria-nombre.pipe';
import { MonedaPipe } from './shared/pipes/moneda.pipe';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { environment } from 'src/environment/environment';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { LoadingInterceptor } from './shared/interceptor/loading.interceptor';
import { NoImagenDirective } from './shared/direrctivas/no-imagen.directive';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    AccesoComponent,
    NavbarComponent,
    FooterComponent,
    Error404Component,
    ItemProductoComponent,
    ListaProductosComponent,
    ListaCategoriasComponent,
    ItemCategoriaComponent,
    ProductosComponent,
    CategoriaNombrePipe,
    MonedaPipe,
    SpinnerComponent,
    CarritoComponent,
    NoImagenDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
