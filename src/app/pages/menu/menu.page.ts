import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false
  // standalone: false // Mantenemos esto como estaba en tu archivo original
})
export class MenuPage implements OnInit {

  // --- Datos de Ejemplo ---
  // En una aplicación real, estos datos vendrían de un servicio que los obtiene de una API

  // Ejemplo para PostCardComponent
  samplePost1 = {
    user: {
      username: '@pandaz667',
      avatar: 'assets/img/pfp2.jpg'
    },
    timestamp: 'Hoy, Hace 30 minutos',
    text: "Sketchbook 10/01/25",
    imageUrl: 'assets/img/42.jpg' // Otra imagen de ejemplo
 };

  samplePost2 = {
    user: {
      username: '@pandaz667',
      avatar: 'assets/img/pfp2.jpg'
    },
    timestamp: 'Hoy, 3:34 pm',
    text: "Dibujo del semestre pasado :p",
    imageUrl: 'assets/img/12.jpg' // Otra imagen de ejemplo
 };

   samplePost3 = {
     user: {
       username: '@okayraynn',
       avatar: 'assets/img/pfp6.jpg'
     },
     timestamp: 'Hoy, 1:57 pm',
     text: "Different explorations of types of background and styles that i never posted! last semester's work hehe",
     imageUrl: 'assets/img/3.jpg' // Otra imagen de ejemplo
  };

  samplePost4 = {
    user: {
      username: '@_ramitadequilo_',
      avatar: 'assets/img/pfp7.jpg' // Reemplaza con una imagen de avatar real o por defecto
    },
    timestamp: 'Ayer, 5:09 pm',
    text: 'Una Vizcacha que está chata.',
    imageUrl: 'assets/img/23.JPG' // Usa la imagen que tienes o una URL
  };



  // Lista de posts para el *ngFor (puedes añadir más posts aquí)
   posts = [this.samplePost1, this.samplePost2, this.samplePost3,  this.samplePost4];

  // Ejemplo para SuggestedUsersComponent
  suggestedUsersData = [
    { username: '@remi_yai', avatar: 'assets/img/pfp5.jpg', name: 'レン' },
    { username: '@baadbored', avatar: 'assets/img/pfp8.jpg', name: 'BAAD' },
  ];

  // Ejemplo para TrendingHashtagsComponent
  trendingHashtagsData = [
    { tag: '#manga', count: '1 mill publicaciones', location: 'Tendencia en Chile' },
    { tag: '#sketch', count: '10 mil publicaciones', location: 'Tendencias' },
    { tag: '#gouache', count: '5 mil publicaciones', location: 'Tendencia en Chile' },
  ];
  // --- Fin Datos de Ejemplo ---

  constructor() { }

  ngOnInit() {
    // Aquí podrías llamar a servicios para cargar los datos reales
  }

}
