import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  estaAutenticado: boolean = false; //Para ver si el usuario ha iniciado o no sesion
  menuAbierto: boolean = false;     //Para abrir o cerrar el menu responsive
  rol: string | null = null;    

  constructor(private authService: AuthService, private ruta: Router) {}

  //Se ejecuta al cargar el componente
  ngOnInit() {
    this.estaAutenticado = this.authService.estaAutenticado(); //Comprueba si hay una sesion activa
    this.rol = localStorage.getItem('rol'); //Obtengo el rol del usuario
  }

  //Para abrir o cerrar el menu responsive
  alternarMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  //Se cierra la sesion tras un mensaje de confirmacion y se redirige al home
  cerrarSesion() {
    if(confirm("¿Estas seguro de que quieres cerrar la sesión?")){
      this.authService.cerrarSesion();
      window.location.href = '/';
    }
  }
}
