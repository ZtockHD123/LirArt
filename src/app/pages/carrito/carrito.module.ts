import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Asegúrate que esté importado
import { IonicModule } from '@ionic/angular';
import { CarritoPageRoutingModule } from './carrito-routing.module';
import { CarritoPage } from './carrito.page';
// Si tienes un SharedComponentsModule que exporta HeaderComponent, impórtalo aquí
// import { SharedComponentsModule } from '../../components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // <--- Necesario para [(ngModel)]
    IonicModule,
    CarritoPageRoutingModule,
    // SharedComponentsModule // <--- Si usas un módulo compartido para el header
  ],
  // Si NO usas un módulo compartido y HeaderComponent no es standalone, decláralo aquí.
  // PERO es mejor práctica usar un módulo compartido o que Header sea standalone.
  declarations: [
      CarritoPage
    ]
})
export class CarritoPageModule {}
