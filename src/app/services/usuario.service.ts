import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.register';
import { LoginForm } from '../interfaces/login-form.interface';
import { map, tap, catchError, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model'
import { cargarUsuario } from '../interfaces/cargar-usuario.interface'
import Swal from 'sweetalert2';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario; //LOS SERVICIOS SON SINGLETONS, ES DECIR EN TODOS LOS LUGARES DONDE SE USE EL USUARIO SE ESTA MANEJANDO LA MISMA INSTANCIA

  constructor( private http: HttpClient, private router: Router ) { }

 

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    google.accounts.id.revoke('', () => {
      this.router.navigateByUrl('/login');
    })
    
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid():string {
    return this.usuario.uid || '';
  }

  get headers() {
    return { 
      headers: {
      'x-token': this.token //ESTE ES EL GET TOKEN
      }
    }
  }
  guardarLocalStorage( token: string, menu: any ) {
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu) ); //El localStorage solo guarda string por lo tanto hay que convertir el menu (porque es un arreglo de objetos)
  }

  


  //CUANDO ME LOGEO O REGISTRO SIEMPRE VOY A PASAR POR ESTA FUNCION YA QUE GUARDS TIENE QUE REVISAR SI EL 
  //TOKEN ES VALIDO O NO INVOCANDO A ESTA FUNCION PARA REDIRECIONAR AL DASHBOARD EN CASO DE SER VALIDO POR LO TANTO SIEMPRE QUE ME
  //ANTES DE DAR LA RESPUESTA GUARDS CREARE UNA NUEVA INSTANCIA DE USUARIO, OBTENIENDO TODOS SUS CAMPOS
  //COMO EMAIL GOOGLE, NOMBRE, UID ETC EN USUARIO

  //IMPORTANTE SIEMPRE QUE ESTEMOS EN UNA PAGINA AUTENTICADA VAMOSA DISPONER DE LA INFORMACION DEL USUARIO LOGEADO
  validarToken(): Observable<boolean> { //LA RESPUESTA DE ESTA FUNCION ES EL TOKEN RENOVADO Y EL USUARIO CON TODOS SUS CAMPOS

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token //ESTE ES EL TOKEN DEL GET ALMACENADO EN EL LOCALSTORAGE CUANDO EL USUARIO SE REGISTRA O SE LOGEA
      }
    }).pipe(
      map( (resp: any) => {
        console.log(resp);
        const { email, google, nombre, role, img='', uid } = resp.usuario; //SE DESESTRUCTURA LO QUE LLEGA DE LA RESPUESTA DEL BACKEND Y SE ALMACENA EN VARIABLES INDEPENDIENTES
        //IMPORTANTE AQUI SE ME MANDA EL USUARIO QUE SE LOGEO (ES DECIR EL USUARIO YA AUTENTICADO)
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid ); //Si la solicitud tiene éxito, el método map transforma la respuesta en un objeto de usuario y lo asigna a la propiedad usuario de la clase que contiene este método
        this.guardarLocalStorage( resp.token, resp.menu );
        //console.log(this.usuario);
        
        return true
      }),
     
      catchError( (error) => of(false) ) //Si la solicitud falla, la función utiliza el operador catchError para capturar el error y devolver un Observable que emite false.
      
    );

  }

  crearUsuario( formData: RegisterForm ){
    console.log('creando usuario')    
    return this.http.post(`${base_url}/usuarios`,formData )
        .pipe( //El operador pipe() es una función que permite encadenar una serie de operaciones sobre un flujo de datos (en este caso, los datos devueltos por la solicitud HTTP)
            tap( (resp: any) => { //el tap() permite interceptar esos datos para realizar una acción específica (en este caso, almacenar el token en el localStorage).
               //En este caso específico, la operación tap() se utiliza para almacenar el valor del token en el localStorage del navegador. El token se obtiene a partir de la respuesta (resp) que se recibe de la solicitud HTTP y se almacena con la llave 'token'.
               this.guardarLocalStorage(resp.token, resp.menu);
            })
        )
  }
  //data: { email: string, nombre: string, role: string }, está indicando que la variable data es un objeto con tres propiedades: email, nombre y role. Cada una de estas propiedades tiene un tipo específico, en este caso, todas son de tipo string
  actualizarPerfil(  data: { email: string, nombre: string, role: string } ){ //aca role no viene como parametro (viene email y nombre en this.perfilForm.value) pero aun asi funciona ya que role simplemente se ignora
    
    data = { //Ahora como role no es un paremetro que haya que ingresar en un formulario (ADEMAS DE QUE ES OBLIGATORIO YA QUE UN MIDDLEWARE EN EL BACKEND NOS LANZA ERROR SI NO LO ENVIAMOS) lo añadirmos despues al objeto data mediante el usuario que INSTANCIAMOS Y OBTUVIMOS cuando validamos token (que es el usuario logeado)
      ...data,
      role: this.usuario.role
    }  

    return this.http.put(`${ base_url }/usuarios/${this.uid}`, data, this.headers) //Para actualizar los datos del usuario se necesita enviar al backend El id que se obtiene de un metodo get que me da el id del usuario logeado que es el mismo que esta intentando actualizar sus datos, la data que se quiere actualizar que es enviada por un formulario y los header con el token de acceso
     
  }



  
  login( formData: LoginForm ){ //formData es un objeto que tiene el tipo LoginForm definido en la interfaz y donde vienen el email y el password
    return this.http.post(`${base_url}/login`,formData ) // IMPORTANTE!! EN ESTE CASO LA RESPUESTA SERIA EL OK:TRUE Y EL TOKEN
        .pipe(                                           //El operador pipe() es una función que permite encadenar una serie de operaciones sobre un flujo de datos (en este caso, los datos devueltos por la solicitud HTTP)
          tap( (resp: any) => { 
                            //el tap() permite interceptar esos datos para realizar una acción específica (en este caso, almacenar el token en el localStorage).
            this.guardarLocalStorage(resp.token, resp.menu);   //La operación tap() se utiliza para almacenar el valor del token en el localStorage del navegador. El token se obtiene a partir de la respuesta (resp) que se recibe de la solicitud HTTP y se almacena con la llave 'token'.
            
          })
        )
  }

  loginGoogle( token: string ){
    return this.http.post(`${ base_url }/login/google`,{ token })
      .pipe(
        tap( (resp: any ) => {
          this.guardarLocalStorage(resp.token, resp.menu);
          
        })
      )
  }

  cargarUsuarios( desde: number = 0 ) {
    //localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<cargarUsuario>( url, this.headers) //cargarUsuario devuelve el total de usuario y un arreglo con los usuarios
        .pipe(
           delay(200),
          map( resp => { //EL MAP ES PARA TRANSFORMAR EL TIPO JSON DE UNA SOLICITUD HTTP AL OBJETO SOLICITADO  EN ESTE CASO OBJETO TIPO USUARIO
            //IMPORTARTE!! ACA DEBEMOS INSTANCIAR DE NUEVO YA QUE EN EL METODO VALIDAR TOKEN OBTENEMOS EL USUARIO QUE ESTA LOGEADO (solo 1 usuario), AQUI OBTENEMOS EL ARREGLO DE USUARIOS QUE SE MOSTRARA EN PANTALLA EN LA PAGINA DE MANTENCIONES/ USUARIOS, ESTO PARA PODER USAR LOS METODOS DE USUARIO COMO USUARIO.IMAGENURL
            const usuarios: Usuario[] = [];
            resp.usuarios.forEach(user => {
              usuarios.push(new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid )); //se instancia cada usuario del arreglo usuario
            });
            /* 
                const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid )
            */
            return {
              total: resp.total,
              usuarios
            }
          })
          
        )
  }

  eliminarUsuario( usuario: Usuario ){
    const url = `${ base_url }/usuarios/${ usuario.uid }`; //SE NECESITA EL UID DEL USUARIO PARA BORRAR
    return this.http.delete( url, this.headers );
  }

  guardarUsuario( usuario: Usuario ){ //Se utiliza la mismo endpoint para actualizar al usuario solo que la funcion tiene otro nombre
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers) 
  }

}
