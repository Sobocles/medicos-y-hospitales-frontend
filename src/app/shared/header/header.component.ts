import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent{

  usuario: Usuario;

  /* Gracias a que en el servicio validarToken instanciamos a un usuario que es el que esta autenticado y obtuvimos todos sus datos,
  podemos recibir sus datos de ese servicio uy almacenarlo en la variable de tipo usuario que creamos
  en este componente para poder mostrarlos en este componente header */
  constructor( private usuarioService: UsuarioService,
                private router: Router ) { 
    this.usuario =  this.usuarioService.usuario; 
    //console.log(this.usuario)
  }

  logout(){
    this.usuarioService.logout();
  }
  //La funcion se activa cuando se escribe en la barra de busqueda global
  buscar( termino: string ){
    if( termino.length === 0 ){
      return
    }
    this.router.navigateByUrl(`/dashboard/buscar/${ termino }`); //Al escribir se redireciona a un nuevo URL (componente busqueda) que incluye el termino buscado
  }

}
