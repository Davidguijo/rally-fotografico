import { Component } from '@angular/core';
import { FotoService } from '../../servicios/foto.service';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../servicios/usuario.service';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {

  tabActual: 'fotos' | 'usuarios' = 'fotos'; //Para controlar la pestaña activa
  fotosPendientes: any[] = []; //Fotos pendientes
  usuarios: any[] = []; //Uusuarios

  //Para que se vean las fotos al ponerlo en produccion (subirlo al hosting)
  readonly BASE_URL = 'https://deepshot.infinityfreeapp.com/uploads/'; //Esto lo uso en el hosting, pero como vamos a hacer uso en local de la página pues no hago uso de esto

  constructor(private fotoService: FotoService, private usuarioService: UsuarioService, private authService: AuthService, private ruta: Router) {}

  ///Funcion que se ejecuta al iniciar el componente
  ngOnInit() {
    this.cargarFotosPendientes(); //Carga las fotos pendientes
    this.cargarUsuarios(); // Carga todos los usuarios registrados
  }

  //Obtiene las fotos pendientes del servidor
  cargarFotosPendientes() {
    this.fotoService.listarFotosPendientes().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.fotosPendientes = res.fotos; //Las guarda en la variable de fotosPendientes
        } else {
          alert("Error: " + res.error);
        }
      },
      error: err => {
        console.log("Error en el server: " + err);
      }
    });
  }

  //Obtiene la lista de los usuarios registrados en la web
  cargarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.usuarios = res.usuarios; //Los guarda en la variable de usuarios
        } else {
          alert("Error: " + res.error);
        }
      },
      error: err => {
        console.log("Error en el server: " + err);
      }
    });
  }

  //Funcion para aceptar o rechazar una foto, cambiando su estado
  cambiarEstado(fotoId: number, nuevoEstado: 'aceptada' | 'rechazada') {
    //Confirm para pedir la confirmacion del admin
    if (confirm("¿Estás seguro de que quieres aceptar esta foto?")) {
      this.fotoService.actualizarEstadoFoto(fotoId, nuevoEstado).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.cargarFotosPendientes(); //Vuelve a cargar las fotos
          }
        },
        error: err => {
          console.log("Error al aceptar la foto: " + err);
          alert("Ha habido un error al intentar aceptar la imagen");
        }
      });
    }
  }

  //Funcion para eliminar a un usuario (tambien elimina sus fotos)
  eliminarUsuario(usuarioId: number) {
    //Confirm para pedir la confirmacion del admin como arriba
    if (confirm("¿Estás seguro de eliminar este usuario? También se borrarán sus fotos")) {
      this.usuarioService.eliminarUsuario(usuarioId).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.cargarUsuarios(); //Recarga la lista de usuarios
            this.cargarFotosPendientes(); //Recarga la lista de fotos pendientes
          }
        },
        error: err => {
          console.log("Error al eliminar al usuario: " + err);
          alert("Error al tratar de eliminar a un usuario");
        }
      });
    }
  }

  //Funcion que rerige a la galeria
  irAGaleria() {
    this.ruta.navigate(['/galeria']);
  }

  //Funcion para cerrar la sesion del admin
  cerrarSesion() {
    if (confirm("¿Estás seguro de que quieres cerrar la sesión?")) {
      this.authService.cerrarSesion();
      window.location.href = '/';
    }
  }
}
