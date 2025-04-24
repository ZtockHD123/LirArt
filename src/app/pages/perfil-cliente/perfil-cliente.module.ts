import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilClientePageRoutingModule } from './perfil-cliente-routing.module';

import { PerfilClientePage } from './perfil-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilClientePageRoutingModule
  ],
  declarations: [PerfilClientePage]
})
export class PerfilClientePageModule {}
