import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public sesionSubject = new BehaviorSubject<boolean>(false);
  get sesion$() {
    return this.sesionSubject.asObservable();
  }
  constructor(private http: HttpClient) {
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

  validarCredenciales(email: string, contraseña: string) {
    const url = `${this.apiUrl}/api/auth/login`;

    return this.http
      .post<any>(url, { email: email, contraseña: contraseña })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(err);
        })
      );
  }

  async registrarUsuario(usuario: Usuario): Promise<boolean> {
    try {
      const url = `${this.apiUrl}/api/auth`;
      await this.http.post<any>(url, usuario);
      // Retornar true después de registrar exitosamente
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
