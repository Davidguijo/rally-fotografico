import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms'; //Para realizar la validación real del dni

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  formularioRegistro: FormGroup; //Formulario reactivo
  cargando = false; //Para mostrar que esta cargando mientras se envia el formulario
  mensajeError = ''; //Mensaje de error en el formulario

  constructor(private fb: FormBuilder, private authService: AuthService, private ruta: Router) {
    //Hago las validaciones del formulario
    this.formularioRegistro = this.fb.group({
      dni: ['', [
        Validators.required, //Campo dni obligatorio
        this.validarDniReal.bind(this) //Hago uso de la validacion real del dni
      ]],
      nombre: ['', [
        Validators.required, //Campo nombre obligatorio
        Validators.minLength(2), //Minima longitud (2)
        Validators.maxLength(20) //Maxima longitud (20)
      ]],
      apellidos: ['', [
        Validators.required, //Campo apellidos obligatorio
        Validators.minLength(5), //Minima longitud (5)
        Validators.maxLength(40) //Maxima longitud (20)
      ]],
      email: ['', [
        Validators.required, //Campo email obligatorio
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) //Utilizo un validador personalizado, pues el que viene por defecto (Validators.email) no valida que haya un . y algo al final
      ]],
      telefono: ['', [
        Validators.required, //Campo telefono obligatorio
        Validators.pattern(/^[0-9]{9}$/) //Expresion regular para comprobar que tenga 9 digitos
      ]],
      password: ['', [
        Validators.required, //Campo contraseña obligatorio
        Validators.minLength(8), //Minima longitud (8)
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/) //Expresion regular para que la contraseña tenga al menos 1 minuscula, 1 mayuscula y 1 numero
      ]],
      confirmarContrasena: ['', Validators.required] //Campo de repetir las contraseñas obligatorio
    }, {
      //Validador creado para comprobar que la contraseña y confirmarContraseña coincidan
      validator: this.validarCoincidenciaContrasenas
    });
  }

  //Estas es la funcion que va a comprobar si contraseña y su confirmacion coinciden
  validarCoincidenciaContrasenas(formulario: FormGroup) {
    return formulario.get('password')?.value === formulario.get('confirmarContrasena')?.value? null: { noCoincide: true };
  }

  //Metodo para validar que sea un dni real
  validarDniReal(control: AbstractControl) {
    const dni = control.value?.toUpperCase() || '';
    if (!dni) return null;
    if (!/^[0-9]{8}[A-Z]$/.test(dni)) return { pattern: true };
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const letraCalculada = letras.charAt(Number(dni.substring(0,8)) % 23);
    return dni.charAt(8) === letraCalculada ? null : { dniInvalido: true };
  }

  //Metodo que va a enviar el formulario
  enviarFormulario() {
    //Si el formulario no es valido o esta cargando se hace un return
    if (this.formularioRegistro.invalid || this.cargando){ 
      return;
    }  
    //Se pone a cargar y se limpia cualquier mensaje de error
    this.cargando = true;
    this.mensajeError = '';

    //Envia todos los datos excepto confirmarContraseña
    const { confirmarContrasena, ...datosUsuario } = this.formularioRegistro.value;

    //Llama al servicio registrar para efectuvamente registrar al usuario
    this.authService.registrar(datosUsuario).subscribe({
      next: (res) => {
        this.cargando = false;

        if (res.success) {
          //Si todo va bien redirige al login
          this.ruta.navigate(['/login']);
        } else {
          //Si va mal muestra un error
          this.mensajeError = res.error || "Error en el registro";
        }
      },
      error: err => {
        //Mensaje de error
        this.cargando = false;
        this.mensajeError = "Error de conexión con el servidor";
        console.log("Error del servidor: " + err);
      }
    });
  }

  //Un get para acceder facilmente a los controles del formulario desde el html
  get controles() {
    return this.formularioRegistro.controls;
  }
}
