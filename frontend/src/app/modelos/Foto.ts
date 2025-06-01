export interface Foto {
  id: number;
  usuario_id: number;
  titulo: string;
  ruta_archivo: string;
  fecha_subida: string | Date;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  usuario_nombre?: string;
  total_votos?: number;
}