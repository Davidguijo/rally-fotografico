import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FotoService } from '../../servicios/foto.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-editar-foto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-foto.component.html',
  styleUrls: ['./editar-foto.component.css']
})
export class EditarFotoComponent implements OnInit {
  formularioEditarFoto: FormGroup;
  fotoId: number = 0;
  imagenPrevia: string | null = null;
  archivo: File | null = null;
  mensajeExito = ''; 
  mensajeError = '';
  fotoOriginal: any = null;
  cargando = true;

  constructor( private fb: FormBuilder, private fotoService: FotoService, private route: ActivatedRoute,private ruta: Router) {
    //Para hacer las validaciones
    this.formularioEditarFoto = this.fb.group({
      titulo: ["", [
        Validators.required, //Titulo obligatorio obligatorio
        Validators.maxLength(20) //Titulo de maximo 20 caracteres
      ]],
      archivo: [null] //Campo para el archivo nuevo
    });
  }

  //El onInit hace que lo que haya aquí se ejecute al iniciar el componente
  ngOnInit() {
    this.fotoId = Number(this.route.snapshot.paramMap.get('id')); //Obtenemos el ID de la ruta
    this.cargarFoto(); //Cargamos las fotos
  }

  //Llamamos a la api para obtener los datos de la foto actual
  cargarFoto() {
    this.fotoService.obtenerFotoPorId(this.fotoId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.fotoOriginal = res.foto; //Guardamos los datos de la foto original
          this.formularioEditarFoto.patchValue({
            titulo: res.foto.titulo //Le ponemos el titulo actual al formulario
          });
          //Preparo la url de la imagen original para mostrarla
          //En el hosting es esta: `https://deepshot.infinityfreeapp.com/uploads/${res.foto.ruta_archivo}`, pero está modificada para poder usarla en local
          this.imagenPrevia = `http://localhost/rally-fotografico/backend/uploads/${res.foto.ruta_archivo}`;
        } else {
          this.mensajeError = res.error || "Error al cargar la fotillo";
        }
        this.cargando = false;
      },
      error: err => {
        //Mensajes de error
        this.mensajeError = "Error de conexión con el servidor";
        this.cargando = false;
        console.log("Erorr: " + err);
      }
    });
  }

  //Se ejecuta cuando el usuario sube una imagen nueva
  onFileChange(event: any) {
    const file = event.target.files?.[0]; //Obtenemos el archivo del input

    if (file) {
      //Declaramos tamaño y tipos permitidos
      const tiposPermitidos = ['image/jpeg', 'image/png'];
      const tamanoMaximoMB = 5;

      //Validamos el tipo
      if (!tiposPermitidos.includes(file.type)) {
        this.mensajeError = "Solo se permiten imágenes JPEG o PNG";
        return;
      }

      //Validamos el tamaño
      if (file.size > tamanoMaximoMB * 1024 * 1024) {
        this.mensajeError = `El tamaño máximo permitido es ${tamanoMaximoMB}MB`;
        return;
      }

      this.archivo = file; //Guardamos el archivo en la memoria

      //Mostramos la vista previa de la imagen nueva
      const reader = new FileReader();
      reader.onload = () => this.imagenPrevia = reader.result as string;
      reader.readAsDataURL(file);

      this.mensajeError = '';//Eliminamos cualquier mensaje de error que haya
    }
  }

  //Para cuando enviamos el formulario
  onSubmit() {
    if (this.formularioEditarFoto.invalid) {
      this.mensajeError = "Por favor debes rellenar el título";
      return;
    }

    //Construyo el formdata para enviar al backend
    const formData = new FormData();
    formData.append('titulo', this.formularioEditarFoto.value.titulo);
    if (this.archivo) {
      formData.append('archivo', this.archivo); //Solo si el usuario subio una nueva imagen
    }
    formData.append('foto_id', this.fotoId.toString()); //Se incluye el id de la foto

    //Enviamos los datos al backend
    this.fotoService.editarFoto(this.fotoId, formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.mensajeExito = "La foto ha sido actualizada";
          setTimeout(() => {
            this.ruta.navigate(['/mis-fotos']); //Le ponemos un delay y despues nos redirige al componente mis-fotos
          }, 1500);
        } else {
          //Mensaje de error
          this.mensajeError = res.error || "Error al actualizar la foto";
        }
      },
      error: err => {
        //Mensaje de error
        this.mensajeError = "Error en la conexión con el servidor";
        console.log("Error: " + err);
      }
    });
  }
}
