import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilILustradorPage } from './perfil-ilustrador.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilILustradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilILustradorPageRoutingModule {}
