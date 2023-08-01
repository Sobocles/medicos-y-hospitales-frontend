import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { RouterModule, Routes } from '@angular/router';

const chilRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },// data: { titulo: 'Dashboard' } se utiliza para adjuntar el dato { titulo: 'Dashboard' } a una ruta específica. Esto permite que el componente asociado a esa ruta pueda acceder a ese dato y utilizarlo según sea necesario, en este caso cada ruta tiene el correspondiente nombre de cada pagina, esto se hace para que en la pagina breadcromps que es donde esta el nombre de cada pagina se extraiga la data y se pueda incluir el nombre en su correspondiente pagina de forma dinamica.
  { path: 'progress', component: ProgressComponent, data: { titulo: 'progressBar'} },
  { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1' }  },
  { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta'} },
  { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Busquedas' }},
  { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas'} },
  { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs'} },
  { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario' }},
  //Mantenimientos
  { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de hospitales'}},
  { path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de Medicos'}},
  { path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Mantenimiento de Medicos'}},

   // Rutas de Admin
   { path: 'usuarios', canActivate: [ AdminGuard ], component: UsuariosComponent, data: { titulo: 'Matenimiento de Usuarios' }},
]

@NgModule({
  imports: [ RouterModule.forChild(chilRoutes) ],
  exports: [ RouterModule ],
})

export class ChildRoutesModule {  }
