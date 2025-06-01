import { Component } from '@angular/core';
import { FotoService } from '../../servicios/foto.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-mis-fotos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-fotos.component.html',
  styleUrls: ['./mis-fotos.component.css']
})
export class MisFotosComponent {
  fotos: any[] = [];
  menuAbierto = false;
  estaAutenticado = false; //Para indicar si el usuario ha iniciado sesión
  usuario: any = null; //Info del usuario
  mostrarMenuPerfil = false; //Para ver si se muestra el menu de perfil

  //Para que se vean las fotos al ponerlo en produccion (subirlo al hosting)
  readonly BASE_URL = 'https://deepshot.infinityfreeapp.com/uploads/'; //Esto es necesario para el hosting, pero como el código es para local no voy a hacer uso de esto

  constructor( private fotoService: FotoService, private usuarioService: UsuarioService, private authService: AuthService, private ruta: Router) {
    this.estaAutenticado = this.authService.estaAutenticado();  //Comprueba si hay una sesion activa
  }

  //Carga las fotos del usuaruio y sus datos al iniciar el componente
  ngOnInit() {
    this.cargarFotos();
    this.cargarUsuario();
  }

  //Ontengo la información del usuario desde el backend
  cargarUsuario() {
    if (this.estaAutenticado) {
      this.usuarioService.obtenerUsuario().subscribe({
        next: (res: any) => {
          if (res.success) {
            this.usuario = res.usuario;
          }
        },
        error: err => console.log("Error al cargar usuario:", err)
      });
    }
  }

  //Para abrir o cerrar el menu del perfil
  alternarMenuPerfil() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;

    if (this.mostrarMenuPerfil) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  //Redirige al componente para editar el perfil
  abrirEditarPerfil() {
    this.alternarMenuPerfil();
    this.ruta.navigate(['/editar-perfil']);
  }

  //Carga las fotos del usuario
  cargarFotos() {
    this.fotoService.listarMisFotos().subscribe({
      next: (res: any) => this.fotos = res,
      error: err => {
        console.log("Error al cargar las fotos: " + err)
      },
    });
  }

  //Redirige al componente editar-foto para editar esa foto especifica
  editarFoto(fotoId: number) {
    console.log('Tamo editando esta fotillo:', fotoId);
    this.ruta.navigate(['/editar-foto', fotoId]);
  }

  //Metodo para eliminar la foto
  eliminarFoto(fotoId: number) {
    //Hacemos un confirm por si le ha dado a borrar sin querer
    if (confirm("¿Estas seguro de eliminar esta foto? La eliminación es permanente")) {
      this.fotoService.eliminarFoto(fotoId).subscribe({
        next: res => {
          this.fotos = this.fotos.filter(f => f.id !== fotoId);// Eliminamos la foto de la lista local
          alert("La foto se ha eliminado");
        },
        error: err => {
          //Mensajitos de error
          console.log("Po va a ser que no elimina nada mi rey " + err),
          alert("Error al eliminar la foto")
        },
      });
    }
  }

  //Metodo para eliminar la cuenta del usuario
  eliminarCuenta() {
    //Hacemos un confirm por si el usuario ha clicado sin querer
    if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible")) {
      this.usuarioService.eliminarCuenta().subscribe({
        next: (res: any) => {
          if (res.success) {
            //Si todo sale bien se le informa al usuario que efectivamente ha salido bien, se cierra sesion y se le redirige al home
            alert("Cuenta eliminada correctamente.");
            this.authService.cerrarSesion();
            window.location.href = '/';
          } else {
            //Y si ha salido mal se le muestra un error
            alert("Error al eliminar la cuenta");
          }
        },
        error: err => {
          //Mnesaje de error
          console.log("Error: " + err);
          alert("Error en el servidor al eliminar la cuenta." + err);
        }
      });
    }
  }

  //Se cierra la sesion tras un mensaje de confirmacion y se redirige al home
  cerrarSesion() {
    if (confirm("¿Estas seguro de que quieres cerrar la sesión?")) {
      this.authService.cerrarSesion();
      window.location.href = '/';
    }
  }
}
