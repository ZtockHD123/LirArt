import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NotificacionesPageRoutingModule } from './notificaciones-routing.module';
import { NotificacionesPage } from './notificaciones.page';
import { SharedModule } from '../../shared.module';
// 1. Elimina la siguiente línea, ya no es necesaria:
// import { MenuPageModule } from '../menu/menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionesPageRoutingModule,
    SharedModule // Con esto es suficiente para usar <app-side-nav>
  ],
  declarations: [NotificacionesPage]
})
export class NotificacionesPageModule {}