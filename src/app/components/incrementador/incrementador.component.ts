import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  ngOnInit() {
    this.btnClass = `btn ${ this.btnClass }`;
  }

  @Input('valor') progreso: number = 40;
  @Input() btnClass: string = 'btn-primary';


  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();

  //AL MOMENTO DE HACER CLICK EN + O - EN MENOS SE ACTIVA ESTA FUNCION
  cambiarValor( valor: number ) {
    //ESTO ES PARA QUE NO SE PASE LA BARRA DE PROGRESO DE 100
    if ( this.progreso >= 100 && valor >= 0 ) {
      this.valorSalida.emit(100);
      return this.progreso = 100; //SI SE PASA PONEMOS EN 100 DE NUEVO LA BARRA DE PROGRESO
    }

    if ( this.progreso <= 0 && valor < 0 ) {
      this.valorSalida.emit(0);
      return this.progreso = 0; //SI PASA DE 0 PONEMOS 0 DE NUEVO
    }

    this.progreso = this.progreso + valor; //SI ES CUALQUIER VALOR ENTRE 0 Y 100 LE SUMAMOS O RESTAMOS A PROGRESO DEPENDIENDO EL BOTON AL CUAL SE LE HIZO CLICK
    this.valorSalida.emit( this.progreso );
  }

  onChange( nuevoValor: number ){
    
    if( nuevoValor >= 100 ) {
      this.progreso = 100;
    } else if ( nuevoValor <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }

    

    this.valorSalida.emit( this.progreso ); //SE EMITE EL VALOR EN QUE QUEDO PROGRESO PARA QUE LA PROGRESS BAR LO RECIBA
  }

}
