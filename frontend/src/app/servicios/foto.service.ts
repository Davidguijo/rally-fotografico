import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FotoService {
  //Url del backend
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //Sube una foto
  subirFoto(formData: FormData) {
    return this.http.post(`${this.url}/subir_foto.php`, formData, { 
      withCredentials: true
    });
  }

  //Lista todas las fotos que estan pendientes (esto para el admin)
  listarFotosPendientes() {
    return this.http.get(`${this.url}/listar_fotos_pendientes.php`, {
      withCredentials: true
    });
  }

  //Lista todas las fotos aceptadas (para que se muestren en la galería publica)
  listarFotosAceptadas() {
    return this.http.get(`${this.url}/galeria.php`, {
      withCredentials: true
    });
  }

  //Lista las fotos que ha subido el usuario (de forma personal)
  listarMisFotos() {
    return this.http.get(`${this.url}/listar_mis_fotos.php`, {
      withCredentials: true
    });
  }

  //Elimina una foto del sistema (lo hace el mismo usuario)
  eliminarFoto(fotoId: number) {
    return this.http.post(
      `${this.url}/eliminar_foto.php`, 
      { foto_id: fotoId },
      { withCredentials: true }
    );
  }

  //Obtiene los datos de una foto por su id
  obtenerFotoPorId(id: number) {
    return this.http.get(`${this.url}/obtener_foto.php?id=${id}`, {
      withCredentials: true
    });
  }

  //Edita una foto existente (titulo o si cambia la imagen)
  editarFoto(fotoId:number,formData: FormData) {
    return this.http.post(`${this.url}/editar_foto.php?id=${fotoId}`, formData, {
      withCredentials: true
    });
  }

  //Actualiza el estado de la foto, de pendiente a aceptada o rechazada (esto solo puede hacerlo el admin)
  actualizarEstadoFoto(fotoId: number, nuevoEstado: 'aceptada' | 'rechazada') {
    return this.http.post(
      `${this.url}/actualizar_estado_foto.php`, 
      { foto_id: fotoId, estado: nuevoEstado },
      { withCredentials: true }
    );
  }

  //Envia un voto para una foto
  votar(fotoId: number) {
    return this.http.post(`${this.url}/votar.php`, { foto_id: fotoId });
  }
}