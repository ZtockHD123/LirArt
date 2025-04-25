import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPage } from './registro.page'; // Importar la página

const routes: Routes = [
  {
    path: '',
    // loadComponent: () => import('./tab2.page').then(m => m.Tab2Page) // Eliminado
    component: RegistroPage // Cambiado para usar component en lugar de loadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroPageRoutingModule {} // Cambiado
