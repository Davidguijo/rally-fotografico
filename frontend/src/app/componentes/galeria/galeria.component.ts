import { Component } from '@angular/core';
import { FotoService } from '../../servicios/foto.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent {
  fotos: any[] = [];
  estaAutenticado: boolean = false;
  votando: number | null = null;//Id de la foto que se vota
  menuAbierto = false; //Control para el menu responsive
  rol: string | null = null;
  fotoSeleccionada: any = null; // Para almacenar la foto ampliada
  mostrarModal: boolean = false; // Controla si se muestra el modal

  //Para que se vean las fotos al ponerlo en produccion (subirlo al hosting)
  readonly baseUrl = 'https://deepshot.infinityfreeapp.com/uploads/'; //En este codigo no hago uso, ya que es solo para subirlo al hosting

  constructor(private fotoService: FotoService, public authService: AuthService, public ruta:Router) {}

  //Metodo que se ejecuta al cargar el componente
  ngOnInit() {
    this.cargarFotos(); //Cargamos las fotos desde el backend
    this.estaAutenticado = this.authService.estaAutenticado();//Verificamos si hay una sesion
    this.rol = localStorage.getItem('rol'); //Obtengo el rol del usuario desde localStorage
  }

  //Cargamos las fotos aceptadas
  cargarFotos() {
    this.fotoService.listarFotosAceptadas().subscribe({
      next: (res: any) => this.fotos = res,
      error: err => console.log("Error: ", + err)
    });
  }

  //Se envia el voto para una foto
  votar(fotoId: number) {
    this.votando = fotoId;
    this.fotoService.votar(fotoId).subscribe({
      next: (res: any) => {
        if (res.success) {
          //Si la votación se hace bien, se incrementan los votos localmente
          const foto = this.fotos.find(f => f.id === fotoId);
          if (foto) {
            foto.total_votos = Number(foto.total_votos || 0) + 1; //Uso number para que no lo trate como string
          }
        } else {
          //Si hubo un error, mostramos un mensaje
          alert(res.error || "No se pudo registrar tu voto.");
        }
        this.votando = null; //Termina la votacion
      },
      error: err => {
        console.log("Error al votar: " +  err);
        this.votando = null;
      }
    });
  }

  //Se ordenan las imagenes por criterio
  ordenarPor(criterio: string) {
    if (criterio === 'votos') {
      //Orden descendente por votos
      this.fotos.sort((a, b) => (b.total_votos || 0) - (a.total_votos || 0));
    } else {
      //Orden descendente por la fecha de subida
      this.fotos.sort((a, b) => new Date(b.fecha_subida).getTime() - new Date(a.fecha_subida).getTime());
    }
  }

  //Para abrir o cerrar el menu responsive
  alternarMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  //Funcion para poner la imagen ampliada
  abrirFotoAmpliada(foto: any) {
    this.fotoSeleccionada = foto;
    this.mostrarModal = true;
  }

  //Funcion para cerrar la imagen ampliada
  cerrarFotoAmpliada() {
    this.mostrarModal = false;
  }

  //Se cierra la sesion tras un mensaje de confirmacion y se redirige al home
  cerrarSesion() {
    if(confirm("¿Estas seguro de que quieres cerrar la sesión?")){
      this.authService.cerrarSesion();
      window.location.href = '/';
    }
  }
}