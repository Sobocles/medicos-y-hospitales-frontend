import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import {BusquedasService } from 'src/app/services/busquedas.service'
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuarioTemp: Usuario[]; //TIENE QUE SER UN ARREGLO PARA QUE LE CAIGAN LAS WEAS CUANDO SE USA this.usuarioTemp = usuarios;

  public imgSubs: Subscription
  public desde: number = 0;
  public cargando: boolean = true;
  


  constructor( private usuarioService: UsuarioService, 
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {  
    this.cargarUsuarios();

    this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img => { 
      console.log(img);
      this.cargarUsuarios()
    });
  }
//IMPORTANTE!! Siempre que me dirija a la pagina usuarios en mantenimientos se accedera a este metodo ya que esta en el ngOnInit
  cargarUsuarios(){
    this.cargando = true; //Se muestra un mensaje de cargando en la pantalla antes de mostrar los usuarios
    this.usuarioService.cargarUsuarios( this.desde )
    .subscribe( ({total, usuarios })=> { //SE DESESTRUCTURA LA RESPUESTA QUE LLEGA DE LA SOLICITUD ()
      this.totalUsuarios = total;
      this.usuarios = usuarios; 
      this.usuarioTemp = usuarios; //revisar el metodo buscar en este mismo componente para enterarme de porque se hace esto
      this.cargando = false;
    })
  }
  //Funcion que se activa cuando le hacemos cliCK a siguiente o anterior en la pagina DE USUARIOS
  cambiarPagina( valor: number ) { //El valor indica que cantidad de usuarios se mostraran en cada pagina (+5 para el boton suguiente, -5 para anterior)
    this.desde +=valor;

    if( this.desde < 0){ //Condicion que evita que al restar -5 a desde valor a desde se obtenga un numero menor a 0
      this.desde = 0;
    } else if( this.desde >= this.totalUsuarios ){ //Condicion que evita que al sumar +5 a desde a desde se obtenga un numero menor a 0
      this.desde -= valor;
    }
    this.cargarUsuarios(); //Luego de hacer las validaciones se muestran los usuarios
  }

  buscar( termino: string ){
    //Esto se hace para que si por ejemplo escribo algo en la barra de busqueda y luego lo borro, vuelvan  a aparecer l pagina con los usuarios cargados (NO LOS QUE APARECEN CUANDO TECLEO EN LA BARRA DE BUSQUEDA SI NO LOS QUE ESTABN ANTES AL CARGAR LA PAGINA)
    if( termino.length === 0){
      return this.usuarios = this.usuarioTemp;
    }
    this.busquedasService.buscar('usuarios', termino )
      .subscribe( (resp: Usuario[]) =>    //IMPORTANTE EN ESTA RESPUESTA PUEDE VENIR UN USUARIO O HOSPITAL DEPENDIENDO DEL TIPO EN EL SWITCH DE BUSQUEDASSERVICE POR LO TANTO HAY QUE ESPECIFICAR QUE ESTAMOS SEGUROS QUE VENDRA UN USUARIO POR EL TIPO
        this.usuarios = resp );           //SE IGUALA A USUARIOS YA QUE USUARIO ESTA EN EL USUARIOS.COMPONENT.HTML EN FORMA DE {{usuario.nombre}} etc Y RESULTADOS TRAE LOS RESULTADOS DE LA BUSQUEDA DEACUERDO AL TERMINO DE LA TECLA QUE SE PRESIONO
  }

  eliminarUsuario( usuario:Usuario ) {
    if( usuario.uid === this.usuarioService.uid ){
      return Swal.fire('Error', 'No se puede borrarse a si mismo', 'error');
    }
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si borralo'
    }).then((result) => {
      if (result.isConfirmed) { //SI EL USUARIO LE DIO CLICK A 'Si borralo'

          this.usuarioService.eliminarUsuario( usuario ) //SE ENVIA EL USUARIO A ELIMINAR CON SU UID
            .subscribe( resp => {  
              /* Posible respuesta del Backend
              {
                "ok": true,
                "msg": "Usuario eliminado"
              }*/           
              this.cargarUsuarios(); //Se cargan de nuevo los usuarios pero sin el que se borró
              Swal.fire(
                'Usuario borrado',
                `${ usuario.nombre } fue eliminado correctamente`,
                'success'                
              ) 
            } 
          )
            
      }
    })
  }
  //Esta funcion se activa cuando se le da click a alguna de las opciones del select (ADMIN ROL O USER ROL)
  cambiarRole( usuario: Usuario ){
    this.usuarioService.guardarUsuario( usuario ) //Se manda el usuario con el rol cambiado para que se actualice en la base de datos, se utiliza la mismo endpoint de actualizar usuario solo que la funcion tiene otro nombre
      .subscribe( resp => {
        console.log(resp);
      })
  }
  //Se activa cuando le doy click en la imagen del usuario que quiero cambiar
  abrirModal( usuario: Usuario ){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
 
}
