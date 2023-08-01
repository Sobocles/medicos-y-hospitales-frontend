import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalImagenComponent } from 'src/app/components/modal-imagen/modal-imagen.component';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';
import { MedicoService } from '../../../services/medico.service'
@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  medicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService  )
               { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargaMedicos();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen 
      .pipe(delay(100))
      .subscribe( img => this.cargaMedicos() );
    }
  
  //Esta funcion se activa apenas se accede a la pagina medicos (porque esta en el ngOnInit)
  cargaMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
        console.log(medicos)
      })

  }
  //Es funcion se activa cuando se teclea en la barra de busqueda
  buscar( termino: string ){ 
  if( termino.length === 0) { //Si no se ha tecleado nada los medicos siempre estaran cargados (o si se borra lo que se escribe)
    return this.cargaMedicos();
  }
    this.busquedasService.buscar('medicos', termino )
      .subscribe( resp => {
          this.medicos = resp; //Los medicos relacionados con el termino buscado de guardan en el arreglo medicos
      })
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }
  //Funcion que se activa cuando le das click en la x en el apartado de acciones en la tabla
  borrarMedico( medico: Medico ) {

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        this.medicoService.borrarMedico( medico._id )
          .subscribe( resp => {
            
            this.cargaMedicos();
            Swal.fire(
              'Médico borrado',
              `${ medico.nombre } fue eliminado correctamente`,
              'success'
            );
            
          });

      }
    })

  }


}
