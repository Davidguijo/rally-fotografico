import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RespuestaLogin } from '../modelos/Respuesta-login';
import { Usuario } from '../modelos/Usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Url para peticiones del backend
  private url = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  //Envio los datos del login al backend y devuelve la respuesta
  iniciarSesion(email: string, contrasena: string) {
    return this.http.post<RespuestaLogin>(`${this.url}/login.php`, { email, password: contrasena }, {
      withCredentials: true //Incluye cookies para sesiones
    });
  }

  //Envio los daros del nuevo usuario al backend para registrarlo
  registrar(usuario: Usuario) {
    return this.http.post<RespuestaLogin>(`${this.url}/registro.php`, usuario);
  }

  //Guardo el token, los datos del usuario y su rol en localStorage
  guardarDatosAuth(token: string, usuario: any, rol: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('rol', rol);
  }

  //Redirige al usuario segun su rol
  redirigirUsuario(rol: string) {
    if (rol === 'administrador') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/mis-fotos']);
    }
  }
  
  //Verifica si hay una sesion activa
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem('usuario');
  }

  //Cierrra la sesion eliminando los datos del localStorage y notifica al backend
  cerrarSesion() {
    localStorage.clear(); //Borra todos los datos del localStorage
    return this.http.post(`${this.url}/cerrar_sesion.php`, {}, {
      withCredentials: true
    });
  }
}