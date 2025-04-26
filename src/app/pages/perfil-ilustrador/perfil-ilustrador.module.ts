// Ruta: src/app/pages/perfil-ilustrador/perfil-ilustrador.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf, *ngFor, | pipe
import { FormsModule } from '@angular/forms'; // Incluir por si acaso
import { IonicModule } from '@ionic/angular'; // Necesario para componentes Ionic

import { PerfilILustradorPageRoutingModule } from './perfil-ilustrador-routing.module';

import { PerfilILustradorPage } from './perfil-ilustrador.page';

// NO se importa SharedModule ni ComentarioItemComponent aquí

@NgModule({
  imports: [
    // Módulos necesarios para la plantilla de la página y el routing
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilILustradorPageRoutingModule
  ],
  declarations: [
    // Declara la página aquí porque NO es standalone
    PerfilILustradorPage
  ]
})
export class PerfilILustradorPageModule {}