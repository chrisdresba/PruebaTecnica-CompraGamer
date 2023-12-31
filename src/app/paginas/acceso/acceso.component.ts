import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { AuthService } from 'src/app/shared/services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SpinnerService } from '../../shared/services/spinner.service';

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
    public auth: AuthService,
    public SpinnerService: SpinnerService
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
            if (usuario.user) {
              this.auth.sesionActive();

              this.SpinnerService.show();
              // Credenciales válidas, el usuario existe
              //localStorage.setItem('sesionUsuario', email);
              setTimeout(() => {
                this.SpinnerService.hide();
                this.router.navigate(['/']);
              }, 0);
            } else {
              // Credenciales inválidas, el usuario no existe o la contraseña es incorrecta
              Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'El usuario o la contraseña son incorrectos!',
              });
            }
          },
          (error) => {
            // Manejar el error en caso de que ocurra durante la validación
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'El usuario o la contraseña son incorrectos!',
            });
          }
        );
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'El usuario o la contraseña son incorrectos!',
      });
    }
  }

  async registrar(): Promise<void> {
    try {
      if (this.formRegistro.valid) {
        if (
          this.formRegistro.value.contraseña !=
          this.formRegistro.value.contraseñaVal
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Las contraseñas deben ser iguales!',
          });
          return;
        }

        const usuario: Usuario = {
          nombre: this.formRegistro.value.nombre,
          apellido: this.formRegistro.value.apellido,
          dni: this.formRegistro.value.dni,
          email: this.formRegistro.value.email,
          telefono: this.formRegistro.value.telefono,
          contraseña: this.formRegistro.value.contraseña,
          id: uuidv4(),
        };

        // Registrar el usuario utilizando el servicio
        const registroExitoso = await this.auth.registrarUsuario(usuario);

        if (registroExitoso) {
          this.SpinnerService.show();
          this.auth.sesionActive();
          //  localStorage.setItem('sesionUsuario', usuario.id);
          setTimeout(() => {
            this.SpinnerService.hide();
            this.router.navigate(['/']);
          }, 0);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'El usuario ya se encuentra registrado!',
          });
        }
      } else {
        console.log('Por favor, completa todos los campos del formulario.');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: ' Se produjo un error, intentelo nuevamente!',
      });
    }
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

  passwordValidacion() {
    const contraseña = this.formRegistro.value.contraseña;
    const contraseñaVal = this.formRegistro.value.contraseñaVal;
    if (this.formRegistro.get('contraseñaVal')?.hasError('required')) {
      return 'Ingrese su contraseña';
    }
    if (this.formRegistro.get('contraseñaVal')?.hasError('minLength')) {
      return 'Mínimo 6 caracteres';
    }
    if (contraseña != contraseñaVal) {
      return 'Las contraseñas no coinciden';
    }
    return '';
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
}
