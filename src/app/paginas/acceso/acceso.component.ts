import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { AuthService } from 'src/app/shared/services/auth.service';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { from } from 'rxjs';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.scss'],
})
export class AccesoComponent {
  public formLogin: FormGroup;
  public formRegistro: FormGroup;
  public vista: boolean = true;
  public vistaClave: boolean = true;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public auth: AuthService
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.formRegistro = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.min(1000000),
          Validators.max(99999999),
        ],
      ],
      telefono: [
        null,
        [
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      contraseñaVal: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async ingresar() {
    try {
      if (this.formLogin.valid) {
        const email = this.formLogin.value.email;
        const contraseña = this.formLogin.value.contraseña;

        this.auth.validarCredenciales(email, contraseña).subscribe(
          (usuario) => {
            if (usuario) {
              // Credenciales válidas, el usuario existe
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1000);
            } else {
              // Credenciales inválidas, el usuario no existe o la contraseña es incorrecta
              console.log(
                'Credenciales inválidas. Por favor, verifica el email y la contraseña.'
              );
            }
          },
          (error) => {
            // Manejar el error en caso de que ocurra durante la validación
            console.log('Error al validar las credenciales:', error);
          }
        );
      }
    } catch (error) {
      console.log('Error catch al validar las credenciales:', error);
    }
  }

  async registrar(): Promise<void> {
    try {
      if (this.formRegistro.valid) {
        const usuario: Usuario = {
          nombre: this.formRegistro.value.nombre,
          apellido: this.formRegistro.value.apellido,
          dni: this.formRegistro.value.dni,
          email: this.formRegistro.value.email,
          telefono: this.formRegistro.value.telefono,
          contraseña: this.formRegistro.value.contraseña,
          id: 10,
          // Otros campos del usuario si los tienes
        };

        // Registrar el usuario utilizando el servicio
        const registroExitoso = await this.auth.registrarUsuario(usuario);

        if (registroExitoso) {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        } else {
          console.log('Error al registrar el usuario.');
        }
      } else {
        console.log('Por favor, completa todos los campos del formulario.');
      }
    } catch (error) {
      console.log(error);
    }

    // Resto del código del componente
  }

  vistaForm() {
    this.vista = !this.vista;
    if (!this.vista) {
      this.vistaClave = true;
    }
  }

  verClave() {
    this.vistaClave = !this.vistaClave;
  }

  passwordValidacion(): boolean {
    const contraseña = this.formRegistro.value.contraseña;
    const contraseñaVal = this.formRegistro.value.contraseñaVal;
    return contraseña === contraseñaVal;
  }

  validarDni() {
    if (this.formRegistro.get('dni')?.hasError('required')) {
      return 'Ingrese su DNI';
    }
    if (this.formRegistro.get('dni')?.hasError('pattern')) {
      return 'Debe ingresar solo números';
    }
    if (
      this.formRegistro.get('dni')?.hasError('min') ||
      this.formRegistro.get('dni')?.hasError('max')
    ) {
      return 'Debe ingresar un DNI válido';
    }
    return '';
  }

  validarTelefono() {
    if (this.formRegistro.get('telefono')?.hasError('required')) {
      return 'Ingrese su telefono';
    }
    if (this.formRegistro.get('telefono')?.hasError('pattern')) {
      return 'Debe ingresar solo números';
    }
    if (
      this.formRegistro.get('telefono')?.hasError('minLength') ||
      this.formRegistro.get('telefono')?.hasError('maxLength')
    ) {
      return 'Debe ingresar un telefono válido';
    }
    return '';
  }

  validarEmail(email: string) {
    let expr =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!expr.test(email)) {
      return false;
    } else {
      return true;
    }
  }

  validarPassword(password: string) {
    if (password.length >= 5) {
      return true;
    } else {
      return false;
    }
  }
}
