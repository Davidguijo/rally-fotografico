import { Component } from '@angular/core';
import { FotoService } from '../../servicios/foto.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-subir-foto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './subir-foto.component.html',
  styleUrls: ['./subir-foto.component.css']
})
export class SubirFotoComponent {
  formularioSubirFoto: FormGroup; //Formulario reactivo
  imagenPrevia: string | null = null; //Para la previsualizacion de la imagen
  archivo: File | null = null; //Archivo que ha seleccionado el usuario
  mensajeExito = '';
  mensajeError = '';

  constructor(private fb: FormBuilder, private fotoService: FotoService, private ruta: Router) {
    //Hcemos las validaciones del formulario 
    this.formularioSubirFoto = this.fb.group({
      titulo: ['', [
        Validators.required, //Campo titulo obligatorio
        Validators.maxLength(20), //Longitud maxima de 20 caracteres
        this.sinEspacios //Validador personalizado para que no cuente solo los espacios
      ]],
      archivo: [null, [
        Validators.required //Archivo requerido
      ]]
    });
  }

  //Manejo del cambio de archivo cuando el usuario selecciona una imagen
  onFileChange(event: any) {
    const file = event.target.files?.[0];

    if (file) {
      //Declaro los tipos y el tamaño maximo permitido
      const tiposPermitidos = ['image/jpeg', 'image/png'];
      const tamanoMaximoMB = 5;

      //Verifico el tipo de archivo
      if (!tiposPermitidos.includes(file.type)) {
        this.mensajeError = "Solo se permiten imágenes JPEG o PNG";
        return;
      }

      //Verfico el tamaño del archivo
      if (file.size > tamanoMaximoMB * 1024 * 1024) {
        this.mensajeError = `El tamaño máximo permitido es ${tamanoMaximoMB}MB`;
        return;
      }

      //Asigno el archivo y hago la previsualizacion
      this.archivo = file;
      this.formularioSubirFoto.patchValue({ archivo: file });

      const reader = new FileReader();
      reader.onload = () => this.imagenPrevia = reader.result as string;
      reader.readAsDataURL(file);

      //Limpio cualquier mensaje de error
      this.mensajeError = '';
    }
  }

  //Para manejar el envio del formulario
  onSubmit() {
    //Si el formulario no es valido por algun motivo nos muestra un mensaje de error y hacemos un return
    if (this.formularioSubirFoto.invalid || !this.archivo) {
      this.mensajeError = "Por favor complete todos los campos correctamente";
      return;
    }

    //Construimos un formdata para enviar el archivo y los datos
    const formData = new FormData();
    formData.append('titulo', this.formularioSubirFoto.value.titulo);
    formData.append('archivo', this.archivo);

    //Llamamos al servicio subirFoto para efectivamente subir la foto
    this.fotoService.subirFoto(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          //Si nada salio mal se nos redigire al componente mis-fotos
          this.ruta.navigate(['/mis-fotos']);
        } else {
          //Si nada salio bien se nos muestra que efectivamente no salio bien
          this.mensajeError = res.error || "Error al subir la foto";
        }
      },
      error: err => {
        //Mensaje de error
        console.log("Error en el servidor: " + err);
        this.mensajeError = "Error en la conexión con el servidor";
      }
    });
  }

  //Validador personalizado para que el usuario no pueda introducir solo espacios
  sinEspacios(control: AbstractControl) {
    const valor = control.value || '';
    return valor.trim().length === 0 ? { soloEspacios: true } : null;
  }
}
