import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilClientePage } from './perfil-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilClientePageRoutingModule {}
