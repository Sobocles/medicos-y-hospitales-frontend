import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

      public menu = [];
  //La funcion cargarMenu  guardamos el menu ya almacenado en el localstorage (del usuario cuando se logeo) en el arreglo menu
  //ojo que la parte del menu que se envio desde el backen corresponde de si es USER_ROLE O ADMIN:ROLE Y ESO SE VE  EN EL BACKEND
  //ESTE SERVICIO DE MENU CON EL ARREGLO DE MENU SE USA EN EL COMPONENTE SIDEBAR PARA MOSTRAR EL MENU O PARTE DE MENU DEPENDIENDO DE LOS PRIVILEGIOS QUE SE LOGEO, USER O ADMIN
  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];
  }

  constructor() { }
}
