import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
  standalone: false
})
export class NotificacionesPage implements OnInit {

  // Datos de ejemplo para las notificaciones
  notifications = [
    { time: 'Hoy, 1:04 am', message: 'Se realizó una compra' },
    { time: 'Hoy, 1:04 am', message: 'Se realizó una devolución' },
    { time: 'Hoy, 1:04 am', message: 'Nuevas notificaciones de posta para @okayraynn y @pandaz667' },
    { time: 'Hoy, 1:04 am', message: 'Post reciente de @remi_yai' },
    { time: 'Hoy, 1:04 am', message: '@buho_lunart indicó que le gusta tu repost' },
    { time: 'Hoy, 1:04 am', message: 'Notificación' },
    { time: 'Hoy, 1:04 am', message: 'Notificación' },
    { time: 'Hoy, 1:04 am', message: 'Notificación' },
    { time: 'Hoy, 1:04 am', message: 'Notificación' },
    { time: 'Hoy, 1:04 am', message: 'Notificación' },
    { time: 'Hoy, 1:04 am', message: 'Notificación' },
    { time: 'Hoy, 1:04 am', message: 'Notificación' },
  ];

  constructor() { }

  ngOnInit() {
  }
}