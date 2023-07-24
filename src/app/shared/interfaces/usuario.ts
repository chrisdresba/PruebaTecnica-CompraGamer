export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: string;
  email: string;
  contraseña: string; // Encriptado
}
