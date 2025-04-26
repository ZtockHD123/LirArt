
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PerfilILustradorPageRoutingModule } from './perfil-ilustrador-routing.module';
import { SharedModule } from '../../shared.module';
import { PerfilILustradorPage } from './perfil-ilustrador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilILustradorPageRoutingModule,
    SharedModule
  ],
  declarations: [
    PerfilILustradorPage
  ]
})
export class PerfilILustradorPageModule {}
