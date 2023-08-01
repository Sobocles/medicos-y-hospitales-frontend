import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor( private settingsService: SettingsService,
               private sidebarService: SidebarService ) { }

  ngOnInit(): void {
    customInitFunctions();
    /*IMPORTANTE, CUANDO NOS LOGEAMOS INSTANTANEAMENTE LLEGAMOS A LA DIRECCION DASHBOARD 
    QUE ES EL COMPONENTE PRINCIPAL LLAMADO PAGES DONDE ESTAN TODAS LAS RUTAS DE LA APLICACION (EN EL HTML)
     CUANDO SE CARGA PAGE COMPONENT SE EJECUTA INMEDIATAMENTE EL SERVICIO this.sidebarService.cargarMenu();
      CON LA FUNCION CARGARMENU (QUE YA ESTA ALOJADO EN EL LOCALSTORAGE CUANDO NOS LOGEAMOS)
       */
    this.sidebarService.cargarMenu();
  }

}
