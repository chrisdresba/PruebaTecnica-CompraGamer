export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: string;
  email: string;
  contraseña: string; // Encriptado
}
