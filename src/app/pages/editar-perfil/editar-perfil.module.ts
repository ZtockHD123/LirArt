import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { EditarPerfilPageRoutingModule } from './editar-perfil-routing.module';

import { EditarPerfilPage } from './editar-perfil.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPerfilPageRoutingModule,
    SharedModule, // Importar SharedModule para usar HeaderComponent
    ReactiveFormsModule // Asegúrate de importar ReactiveFormsModule
  ],
  declarations: [EditarPerfilPage]
})
export class EditarPerfilPageModule {}