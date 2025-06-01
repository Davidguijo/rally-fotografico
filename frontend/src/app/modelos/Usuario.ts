export interface Usuario {
  id?: number;
  dni: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  password?: string;
  rol?: 'administrador' | 'participante';
}