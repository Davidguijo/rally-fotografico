import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  formularioUsuario: FormGroup; //Formulario reactivo
  cargando = false; //Control al enviar el formulario
  mensajeError = ''; //Muestra los mensajes de error

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private ruta: Router  ) {
    //Para hacer las validaciones
    this.formularioUsuario = this.fb.group({
      nombre: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(20)
      ]],
      apellidos: ['', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(40)
      ]],
      email: ['', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) //Utilizo un validador personalizado, pues el que viene por defecto (Validators.email) no valida que haya un . y algo al final
      ]],
      telefono: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{9}$/)
      ]]
    });
  }

  //Funcion que se ejecuta al iniciar el componente
  ngOnInit() {
    this.cargarDatosUsuario();//Carga los datos del usuario actual
  }

  //Obtiene los datos del usuario desde el backend y los pone en el formulario
  cargarDatosUsuario() {
    this.usuarioService.obtenerUsuario().subscribe({
      next: (res: any) => {
        if (res.success) { 
          const usuario = res.usuario;

          //Se cargan los datos en el formulario
          this.formularioUsuario.patchValue({
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            telefono: usuario.telefono
          });
        } else {
          //Se muestra un mensaje de error si ocurre
          this.mensajeError = res.error || "Error al cargar los datos";
        }
      },
      error: err => {
        //Se muestra un mensaje si ocurre un error con el servidor
        this.mensajeError = "Error de conexion con el servidor";
        console.log("Error en el servidor: " + err);
      }
    });
  }

  //Metodo para enviar el formulario
  enviarFormulario() {
    //Si el formulari no es valido o esta cargando se hace un return
    if (this.formularioUsuario.invalid || this.cargando){
      return;
    }

    this.cargando = true;  //Se pone como cargando
    this.mensajeError = ''; //Se elimina cualquier mensaje de error si lo hubiese

    //Se llama a la funcion para actualizar los datos
    this.usuarioService.actualizarUsuario(this.formularioUsuario.value).subscribe({
      next: res => {
        this.cargando = false;
        //Redirige al usuario al componetne de sus fotos
        if (res.success) {
          this.ruta.navigate(['/mis-fotos']);
        } else {
          this.mensajeError = res.error;
        }
      },
      error: err => {
        //Mensaje de error
        this.cargando = false;
        this.mensajeError = "Error de conexion con el servidor";
        console.log("Error: " + err);
      }
    });
  }

  //Un get para acceder facilmente a los controles del formulario desde el html
  get controles() {
    return this.formularioUsuario.controls;
  }
}
