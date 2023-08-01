import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [
    { 
        
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ AuthGuard ], //TODAS ESTAS RUTAS ESTAN PROTEGIDAS, SI NO ESTA AUTENTICADO NO DEBERIA VER NINGUNA DE ESTAS
        canLoad: [ AuthGuard ],
        loadChildren: () => import('./child-routes.module').then( m => m.ChildRoutesModule)
        
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


