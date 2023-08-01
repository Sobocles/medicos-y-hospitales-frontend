import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service'

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor( private hospitalService: HospitalService, private modalImagenService: ModalImagenService, private busquedasService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
      this.cargarHospitales();

      this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(delay(100))
          .subscribe( img => this.cargarHospitales() );
  }
    //Esto se activa cuando se teclea en la barra de busqueda
    buscar( termino: string ){
        if( termino.length === 0 ){
          return this.cargarHospitales();
    }
    
        this.busquedasService.buscar( 'hospitales', termino ) //Se envia el tipo y el termino
          .subscribe( resp => {
            this.hospitales = resp; //Los hospitales que coinciden con lo que se escribio se mostraran en pantalla
          });
        }

    cargarHospitales(){

      this.cargando = true; //Esto es elmensaje de cargando que aparece por unos segundo antes de que aparescan los hospitales
      this.hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          this.cargando = false; //Cuando se cargan los hospitales se quita
          this.hospitales = hospitales;
        })
    }
    //fUNCION QUE GUARDA LOS CAMBIOS CUANDO SE LE CAMBIA EL NOMBRE AL HOSPITAL
    guardarCambios( hospital: Hospital ){
      this.hospitalService.actualizarHospital( hospital._id, hospital.nombre ) //Se mandan el id del hospitañ y el nombre nuevo del hospital que el usuario tecleo
        .subscribe( resp => {
          Swal.fire( 'Actualizado', hospital.nombre, 'success')
        })
    }
    //La funcion se activa cuando se le hace click en la x en el apartado acciones
    eliminarHospital( hospital: Hospital ){
      this.hospitalService.borrarHospital( hospital._id )
        .subscribe( resp => {
          this.cargarHospitales();
          Swal.fire('Borrado', hospital.nombre, 'success' );
        });
    }
    //Modal que se abre al momento de hacer click en crear hospital
    async abrirSweetAlert(){
      const { value = '' } = await Swal.fire<string>({ //En el value se almacena lo que escribe el usuario en la ventana Emergente del sweetAlert (si value no tiene ningun valor se iguala a un string vacio)
        title: 'Crear hospital',
        text: 'Ingrese el nombre del nuevo hospital',
        input: 'text',
        inputPlaceholder: 'Nombre del hospital',
        showCancelButton: true,
      })
      //Si value.trim().length > 0 quiere decir que usuario escribio algo
      if( value.trim().length > 0 ) { //La expresión value.trim() devuelve una nueva cadena de caracteres con los espacios en blanco eliminados.
        this.hospitalService.crearHospital( value )
        .subscribe( (resp:any) => { //La respuesta viene con el hospital creado
          this.hospitales.push( resp.hospital ) //Se ingresa al arreglo de hospitales para que el cambio con el nuevo hospital se vea reflejado en la pantalla al instante
        })
      }
    }

    abrirModal(hospital: Hospital){
      this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
      console.log(hospital.img);
    }

}
