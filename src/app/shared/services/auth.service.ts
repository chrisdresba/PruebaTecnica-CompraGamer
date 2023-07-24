import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';
import * as bcryptjs from 'bcryptjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuariosKey = 'usuariosDB';
  public sesionSubject = new BehaviorSubject<boolean>(false);
  get sesion$() {
    return this.sesionSubject.asObservable();
  }
  constructor() {
    const estado = localStorage.getItem('sesionUsuario');
    if (estado) {
      this.sesionActive();
    } else {
      this.sesionInactive();
    }
  }

  sesionActive() {
    this.sesionSubject.next(true);
  }

  sesionInactive() {
    this.sesionSubject.next(false);
  }

  obtenerUsuarios(): Usuario[] {
    try {
      const usuariosJson = localStorage.getItem(this.usuariosKey);
      return usuariosJson ? JSON.parse(usuariosJson) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  buscarIdUsuarioPorEmail(email: string) {
    try {
      const usuarios = this.obtenerUsuarios();
      const usuario = usuarios.find((u) => u.email === email);

      if (!usuario) {
        return of(null);
      } else {
        return usuario.id;
      }
    } catch (error) {
      console.error(error);
      return of(null);
    }
  }

  validarCredenciales(email: string, contraseña: string) {
    const usuarios = this.obtenerUsuarios();
    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario) {
      // Usuario no encontrado, devuelve null
      return of(null);
    }

    // Convierte la promesa a un observable usando 'from'
    return from(bcryptjs.compare(contraseña, usuario.contraseña)).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  async registrarUsuario(usuario: Usuario): Promise<boolean> {
    try {
      // Obtener usuarios
      const usuariosJson = localStorage.getItem(this.usuariosKey);
      const usuarios: Usuario[] = usuariosJson ? JSON.parse(usuariosJson) : [];

      // Comprobar si existe el usuario
      const usuarioExistente = usuarios.find(
        (u) => u.email === usuario.email || u.dni === usuario.dni
      );
      console.log(usuarioExistente);
      if (usuarioExistente) {
        // El usuario ya existe, mostrar mensaje de que ya está registrado
        return false;
      } else {
        const saltRounds = 10;
        const hash = await bcryptjs.hash(usuario.contraseña, saltRounds);
        usuario.contraseña = hash;

        usuarios.push(usuario);
        localStorage.setItem(this.usuariosKey, JSON.stringify(usuarios));

        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
