import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuPage } from './menu.page';

// --- Importa los nuevos componentes ---
// Asumiendo que los crearás en app/components/nombre-componente
// Si los creas en otro lugar, ajusta la ruta de importación.
// **NOTA:** Una mejor práctica es crear un SharedComponentsModule e importarlo aquí.
// Por simplicidad, los importamos directamente por ahora.
import { HeaderComponent } from '../../components/header/header.component'; // Ya deberías tenerlo importado o declarado en otro módulo
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { SuggestedUsersComponent } from '../../components/suggested-users/suggested-users.component';
import { TrendingHashtagsComponent } from '../../components/trending-hashtags/trending-hashtags.component';
// --- Fin importaciones ---

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule
  ],
  // --- Declara los componentes que pertenecen a este módulo ---
  declarations: [
    MenuPage,
    HeaderComponent, // O impórtalo si viene de otro módulo
    SideNavComponent,
    PostCardComponent,
    SuggestedUsersComponent,
    TrendingHashtagsComponent
  ]
})
export class MenuPageModule {}
