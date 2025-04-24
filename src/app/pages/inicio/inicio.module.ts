// src/app/pages/inicio/inicio.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Añadir si usas ngModel
import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module'; // Importa el routing
import { InicioPage } from './inicio.page'; // Importa el componente

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Añadir si usas ngModel
    IonicModule, // Importa IonicModule para usar componentes Ionic
    InicioPageRoutingModule // Importa las rutas específicas de esta página
  ],
  declarations: [InicioPage] // Declara el componente InicioPage
})
export class InicioPageModule {}
