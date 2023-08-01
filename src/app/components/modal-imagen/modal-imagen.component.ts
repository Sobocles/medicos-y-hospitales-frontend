import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';
import {ModalImagenService} from '../../services/modal-imagen.service'
@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp : any = null;

  constructor( public modalImagenService: ModalImagenService, private fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }
  //Cerrar modal se activa cuando se hace click en la x superior derecha del modal o en cancelar
  cerrarModal(){
    this.imgTemp = null; //Esto es para que si se escoge una imagen y se cierra el modal, si una vez que se habra de nuevo dicho modal la imagen de la vista previa anterior no aparecera
    this.modalImagenService.cerrarModal(); //Esta funcion en el servicio solo cambia _ocultarModal = true;
  }

  cambiarImagen( file: File ){ //El evento que se dipara es de tipo file
    this.imagenSubir = file;

    if( !file ) { 
      return this.imgTemp = null;
     }
    
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      
    }
  }

  subirImagen(){

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto( this.imagenSubir, tipo, id )
      .then( img => {
         Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success'); 

         this.modalImagenService.nuevaImagen.emit(img);
         
         this.cerrarModal();
         }).catch( err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
         })
  }



}
