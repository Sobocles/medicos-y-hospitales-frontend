import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: 'usuarios' | 'medicos' | 'hospitales';
  public id: string;
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultarModal
  }
  //this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',  //Se compueba el tipo
    id: string,
    img: string = 'no-img',
  ){
    this._ocultarModal = false; //Esto es lo que abre el modal (esta referencia en el componente del modal con esta expresion [class.oculto]="modalImagenService.ocultarModal")
    this.tipo = tipo; //Se guarda el tipo
    this.id = id; //Se guarda el id

    //this.img = img;
    if( img.includes('https') ) { //Si es un usuario de Google
      this.img = img; //No se le incluye imagen
    } else {
      /*
        Se le asigna el path de la imagen (Endpoint para ver imagen) Para que el usuario una
        vez le dio click a la  imagen que quiere cambiar y en consecuencia se abra el modal,
        la imagen se exponga en grande en el modal recien abierto para ser cambiada mediante examinar que activa
        la funcion cambiar imagen que esta en el componente del modal
      */
      this.img = `${ base_url }/upload/${ tipo }/${ img }`;
      console.log(this.img);
    }
  }

  cerrarModal(){
    this._ocultarModal = true;
  }
}
