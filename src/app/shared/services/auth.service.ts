import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';
import * as bcryptjs from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuariosKey = 'usuariosDB';

  constructor() {}

  obtenerUsuarios(): Usuario[] {
    try {
      const usuariosJson = localStorage.getItem(this.usuariosKey);
      return usuariosJson ? JSON.parse(usuariosJson) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /* async validarCredenciales(
    email: string,
    contraseña: string
  ): Promise<Usuario | null> {
    try {
      const usuarios = this.obtenerUsuarios();
      console.log(email, contraseña);
      const usuario = usuarios.find((u) => u.email === email);
      console.log(contraseña, usuario);

      if (!usuario) {
        return null; // Usuario no encontrado, devolver null
      }

      const contraseñaValida = await bcryptjs.compare(
        contraseña,
        usuario.contraseña
      );

      if (contraseñaValida) {
        return usuario; // La contraseña es válida, devolver el usuario encontrado
      } else {
        return null; // La contraseña es inválida, devolver null
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }*/

  validarCredenciales(email: string, contraseña: string) {
    const usuarios = this.obtenerUsuarios();
    console.log(email, contraseña);
    const usuario = usuarios.find((u) => u.email === email);
    console.log(contraseña, usuario);

    if (!usuario) {
      // Usuario no encontrado, devolver null
      return of(null);
    }

    // Convertir la promesa a un observable usando 'from'
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
      console.log(usuarios);
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
