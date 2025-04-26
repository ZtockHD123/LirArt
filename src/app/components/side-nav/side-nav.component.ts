import { Component, OnInit } from '@angular/core';
import { IonList } from "@ionic/angular/standalone";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  standalone: false
})
export class SideNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  // Puedes añadir métodos aquí para manejar clics en los items del menú
  // por ejemplo: goTo(page: string) { ... }
}
