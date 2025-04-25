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
      username: '@okayraynn',
      avatar: 'assets/img/raydraw1.png' // Reemplaza con una imagen de avatar real o por defecto
    },
    timestamp: 'Hoy, 1:04 am',
    text: 'Ay subi el mismo dibujo ajsdjasdasd',
    imageUrl: 'assets/img/hoshino.jpg' // Usa la imagen que tienes o una URL
  };

  samplePost2 = {
     user: {
       username: '@okayraynn',
       avatar: 'assets/img/raydraw1.png'
     },
     timestamp: 'Ayer, 5:09 pm',
     text: 'Skibidi sigma, soy sigma, sigma, sigma, soy sigma',
     imageUrl: 'assets/img/raydraw1.png' // Otra imagen de ejemplo
  };

  // Lista de posts para el *ngFor (puedes añadir más posts aquí)
   posts = [this.samplePost1, this.samplePost2];

  // Ejemplo para SuggestedUsersComponent
  suggestedUsersData = [
    { username: '@panda667', avatar: 'assets/img/hoshino.jpg', name: 'Panda' },
    { username: '@user2', avatar: 'assets/img/raydraw1.png', name: 'Estela' },
  ];

  // Ejemplo para TrendingHashtagsComponent
  trendingHashtagsData = [
    { tag: '#manga', count: '1 mill publicaciones', location: 'En Chile' },
    { tag: '#sketch', count: '10 mil publicaciones', location: 'En Chile' },
    { tag: '#arte', count: '5 mil publicaciones', location: 'En Chile' },
  ];
  // --- Fin Datos de Ejemplo ---

  constructor() { }

  ngOnInit() {
    // Aquí podrías llamar a servicios para cargar los datos reales
  }

}
