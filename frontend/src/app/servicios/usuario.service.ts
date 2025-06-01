import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../modelos/Usuario';
import { environment } from '../../environments/environment';
import { RespuestaLogin } from '../modelos/Respuesta-login';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  //Url para las peticiones al backend
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //Obtiene la lista de los usuarios registrados (de esto hace uso el admin)
  listarUsuarios() {
    return this.http.get(`${this.url}/listar_usuarios.php`, {
      withCredentials: true //Incluye cookies para sesion
    });
  }

  //Obtiene los datos del usuario que tiene la sesion activa
  obtenerUsuario() {
    return this.http.get(`${this.url}/obtener_usuario.php`, {
      withCredentials: true
    });
  }

  //Elimina a un usuario por su id (cositas del admin)
  eliminarUsuario(id: number) {
    return this.http.post(`${this.url}/eliminar_usuario.php`, { id },
      { withCredentials: true }
    );
  }

  //Elimina la cuenta del usuario que esta logueado (esto lo hace el propio usuario, no el admin)
  eliminarCuenta() {
    return this.http.post(`${this.url}/eliminar_cuenta.php`,{}, 
      { withCredentials: true }
    );
  }

  //Actualiza los datos del usuario: nombre, email, etc
  actualizarUsuario(datos:any) {
    return this.http.post<any>(`${this.url}/editar_usuario.php`, datos,
      { withCredentials: true }
    );
  }
}
