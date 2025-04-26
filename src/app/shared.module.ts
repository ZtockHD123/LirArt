// app/shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

import { HeaderComponent } from './components/header/header.component'; // Ajusta la ruta si es necesario

@NgModule({
  declarations: [
    HeaderComponent // Declara tu componente aquí
  ],
  imports: [
    CommonModule,
    IonicModule // Importa IonicModule
  ],
  exports: [
    HeaderComponent // Exporta tu componente para que otros módulos puedan usarlo
  ]
})
export class SharedModule { }
