// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formularioLogin: FormGroup; //Formulario reactivo
  cargando = false;   
  mensajeError = '';         

  constructor(private fb: FormBuilder, private authService: AuthService, private ruta: Router) {
    //Para validar los datos del formulario
    this.formularioLogin = this.fb.group({
      email: ['', [
        Validators.required, //Campo email obligatorio
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) //Utilizo un validador personalizado, pues el que viene por defecto (Validators.email) no valida que haya un . y algo al final
      ]],
      password: ['', [
        Validators.required, //Campo contraseña obligatorio
        Validators.minLength(8), //Que el campo de la contraseña tenga 8 caracteres como minimo
        this.sinEspacios //Para validar que la contraseña no sean solo espacios
      ]]
    });
  }

  //Metodo para enviar el formulario al backend
  enviarFormulario() {
    //Si el formulario no es válido o cargando lo devuelve
    if (this.formularioLogin.invalid || this.cargando) {
      return;
    }

    this.cargando = true; //Actica la carga
    this.mensajeError = ''; // Limpia mensajes de error si hubiera alguno antes

    //Llamo al servicio de iniciar sesion
    this.authService.iniciarSesion(this.formularioLogin.value.email, this.formularioLogin.value.password).subscribe({
      next: (res: any) => {
        if (res.success) {
          //Si se hace bieb, guardo el token y los datos y se redirige (ira a un lado o otro dependiendo del rol)
          this.authService.guardarDatosAuth(res.token, res.usuario, res.rol);
          this.authService.redirigirUsuario(res.rol);
        } else {
          //Si algo falla, muestra un error
          this.cargando = false;
          this.mensajeError = res.error || "Los datos introducidos no son correctos";
        }
      },
      error: err => {
        //Este error salta cuando se produce un faallo al intentar conectarse con el servidor
        this.cargando = false;
        this.mensajeError = "Error al conectarse con el servidor";
        console.log("Ha petao el server : " + err);
      }
    });
  }

  //Un get para acceder facilmente a los controles del formulario desde el html
  get controles() {
    return this.formularioLogin.controls;
  }

  //Validador personalizado para que el usuario no pueda introducir solo espacios
  sinEspacios(control: AbstractControl) {
    const valor = control.value || '';
    return valor.trim().length === 0 ? { soloEspacios: true } : null;
  }
}
