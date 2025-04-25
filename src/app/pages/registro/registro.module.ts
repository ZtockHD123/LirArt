import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Cambiado de FormsModule
import { RegistroPageRoutingModule } from './registro-routing.module'; // Cambiado
import { RegistroPage } from './registro.page'; // Importar la página/componente

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule, // Asegúrate que sea este el que necesitas (usado en el .ts)
    RegistroPageRoutingModule // Cambiado
  ],
  declarations: [RegistroPage] // Declarar la página/componente
})
export class RegistroPageModule {} // Cambiado
