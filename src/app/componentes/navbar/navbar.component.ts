import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { Carrito } from 'src/app/shared/interfaces/carrito';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public vistaCategorias: boolean = false;
  contador: number = 0;
  arrayCategorias: any[] = [];
  sesion: boolean = false;
  public vistaCarrito: boolean = false;
  public carrito?: Carrito;

  constructor(
    public router: Router,
    public service: CarritoService,
    public servCategorias: DataService,
    public auth: AuthService,
    public spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.service.carritoItemCount$.subscribe((count) => {
      this.contador = count;
    });

    this.auth.sesion$.subscribe((sesion) => {
      this.sesion = sesion;
    });

    this.servCategorias.obtenerSubcategorias().subscribe((categorias) => {
      this.arrayCategorias = categorias;
    });

    this.traerCarrito();
  }

  verCategorias() {
    this.vistaCategorias = !this.vistaCategorias;
  }

  categoriaPorId(id: number) {
    this.verCategorias();
    this.router.navigate([`/categorias/${id}`]);
  }

  traerCarrito() {
    this.carrito = this.service.obtenerCarrito();
  }

  verCarrito() {
    this.vistaCarrito = !this.vistaCarrito;
  }

  limpiarCarrito() {
    this.verCarrito();
    this.carrito = undefined;
    localStorage.removeItem('carrito');
    this.service.carrito = { items: [], total: 0, id: '' };
    this.service.actualizarContadorCarrito();
  }

  salir() {
    localStorage.removeItem('sesionUsuario');
    this.auth.sesionInactive();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.router.navigate(['/ingresar']);
    }, 500);
  }
}
