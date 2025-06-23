import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { BusquedasComponent } from './components/busquedas/busquedas.component';
// 1. Importa el SideNavComponent
import { SideNavComponent } from './components/side-nav/side-nav.component';

@NgModule({
  // 2. Añade SideNavComponent a las declaraciones
  declarations: [HeaderComponent, BusquedasComponent, SideNavComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  // 3. Añade SideNavComponent a las exportaciones
  exports: [HeaderComponent, BusquedasComponent, SideNavComponent]
})
export class SharedModule { }