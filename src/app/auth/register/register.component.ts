import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmitted = false; //esta variable se cambiara a true cuando se le de click a sight up (crear usuario)

  public registerForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.required]],
    password: ['', Validators.required ],
    password2: ['', Validators.required ],
    terminos: ['', Validators.required] 

  }, {
    validators: this.passwordsIguales('password','password2') //SE ENVIAN LOS DOS ARGUMENTOS QUE SE QUIEREN VALIDAR EN ESTA VALIDACION PERSONALIZADA QUE VALIDA SI LOS PASSWORDS ES IGUAL A LA CONFIRMACION DE PASSWORED
  });


  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true;
    console.log( this.registerForm.value );
    //console.log( this.registerForm.value );

    if( this.registerForm.invalid ){ //sI EL FORMULARIO ES INVALIDO NO SE ENVIARA A LA BASE DE DATOS
      return
    }

    // Realizar el posteo
    this.usuarioService.crearUsuario( this.registerForm.value )
        .subscribe( resp => {
          
        // Navegar al Dashboard ya que el registro fue EXITOSO!!
        this.router.navigateByUrl('/');

        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error'); //al incluir err.error.msg se Accede al mensaje de error incluido en el backenend en caso de que el correo ya este registrado
        } );
  }

  campoNoValido( campo: string ): boolean {
    if( this.registerForm.get(campo).invalid && this.formSubmitted ){ //SI EL FORMULARIO SE POSTEO Y EL CAMPO NO ES VALIDO
      return true; //Returna true, es decir que en el ngIf del html saltara un error de que el campo no es valido
      } else{
        return false;
      }
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if((pass1 !== pass2 ) && this.formSubmitted ) { //SI L PERSONA MANDO EL POSTEO DEL FORMULARIO Y LAS CONTRASENAS SON DIFERENTES
      return true;
      } else {
        return false;
      }
    }
  

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted; //SI LA PERSONA ENVIO EL POSTEO DEL FORMULARIO Y TERMINOS EST EN FALSO (NO SE HAN ACEPTADO LOS TERMINOS) SE ENVIA EL MENSAJE PUESTO EN HTML
  }


  passwordsIguales(pass1Name: string, pass2Name:string ){
    //ES OBLIGATORIO ACA QUE SE DEBA RETORNAR UNA FUNCION
    return( formGroup: FormGroup ) => {
      
      const pass1Control = formGroup.get(pass1Name); //SE UTILIZA fromGroup PARA OBTENER LOS VALORES DE LA CONTRASEÑA Y ALMACENARLOS EN LA VARIABLE PARA LUEGO COMPARARLOS
      const pass2Control = formGroup.get(pass2Name);

      if( pass1Control.value === pass2Control.value ){
        pass2Control.setErrors(null) //SI SON IGUALES NO HAY ERRORES
      } else {
        pass2Control.setErrors({ noEsIgual: true }) //SE LE AÑADE UN OBJETO QUE INDICA QUE HAY ERROR
      }

    }
  }
}


