import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuPage } from './menu.page';

import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { SuggestedUsersComponent } from '../../components/suggested-users/suggested-users.component';
import { TrendingHashtagsComponent } from '../../components/trending-hashtags/trending-hashtags.component';
import { SharedModule } from '../../shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    SharedModule
  ],

  declarations: [
    MenuPage,
    SideNavComponent,
    PostCardComponent,
    SuggestedUsersComponent,
    TrendingHashtagsComponent
  ]
})
export class MenuPageModule {}
