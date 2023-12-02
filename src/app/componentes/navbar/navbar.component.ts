import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { Carrito } from 'src/app/shared/interfaces/carrito';
import { UntypedFormControl } from '@angular/forms';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
  public formBuscador: FormGroup;

  constructor(
    public router: Router,
    public service: CarritoService,
    public servCategorias: DataService,
    public auth: AuthService,
    public spinner: SpinnerService,
    public fb: FormBuilder
  ) {
    this.formBuscador = this.fb.group({
      buscador: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.service.carritoView.subscribe((vista) => {
      this.vistaCarrito = vista;
    });
  }

  ngOnInit(): void {
    this.service.carritoItemCount$.subscribe((count) => {
      this.contador = count;
    });

    this.auth.sesion$.subscribe((sesion) => {
      this.sesion = sesion;
    });

    this.servCategorias.obtenerSubcategorias().subscribe((data) => {
      this.arrayCategorias = data;
      this.arrayCategorias.sort((a, b) => {
        const nombreA = a.nombre.toLowerCase();
        const nombreB = b.nombre.toLowerCase();
        return nombreA.localeCompare(nombreB);
      });
    });

    this.traerCarrito();
  }

  verCategorias() {
    this.vistaCategorias = !this.vistaCategorias;
    this.traerCarrito();
  }

  productosPorSubcategoria(nombre: string) {
    this.vistaCategorias = false;
    const categoria = this.servCategorias.reemplazarEspaciosUrl(nombre, 0);
    this.router.navigate([`/productos/${categoria.toLocaleLowerCase()}`]);
  }

  traerCarrito() {
    this.carrito = this.service.obtenerCarrito();
  }

  eliminarDelCarrito(id: number) {
    try {
      this.service.eliminarProducto(id);
    } catch (error) {
      console.error(error);
    }
  }

  verCarrito() {
    this.vistaCategorias = false;
    console.log(this.vistaCarrito);
    if (this.vistaCarrito) {
      this.service.carritoViewInactive();
    } else {
      this.traerCarrito();
      this.service.carritoViewActive();
    }
  }

  limpiarCarrito() {
    this.verCarrito();
    this.carrito = undefined;
    localStorage.removeItem('carrito');
    this.service.carrito = { items: [], total: 0, id: '' };
    this.service.actualizarContadorCarrito();
  }

  buscar() {
    try {
      if (this.formBuscador.valid) {
        this.router.navigate([
          `/productos/buscar=${this.formBuscador.value.buscador.toLocaleLowerCase()}`,
        ]);
        this.formBuscador.reset();
      }
    } catch (error) {
      console.log(error);
    }
  }

  ingresar() {
    this.service.carritoViewInactive();
    this.vistaCategorias = false;
    this.router.navigate(['/ingresar']);
  }

  salir() {
    localStorage.removeItem('sesionUsuario');
    this.auth.sesionInactive();
    this.spinner.show();
    this.service.carritoViewInactive();
    this.vistaCategorias = false;
    setTimeout(() => {
      this.spinner.hide();
      this.router.navigate(['/ingresar']);
    }, 500);
  }
}
