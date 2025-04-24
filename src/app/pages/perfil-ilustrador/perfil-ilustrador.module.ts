import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilILustradorPageRoutingModule } from './perfil-ilustrador-routing.module';

import { PerfilILustradorPage } from './perfil-ilustrador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilILustradorPageRoutingModule
  ],
  declarations: [PerfilILustradorPage]
})
export class PerfilILustradorPageModule {}
