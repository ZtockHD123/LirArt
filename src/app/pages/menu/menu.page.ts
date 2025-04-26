import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false
})
export class MenuPage implements OnInit {

  samplePost1 = {
    user: {
      username: '@pandaz667',
      avatar: 'assets/img/pfp2.jpg'
    },
    timestamp: 'Hoy, Hace 30 minutos',
    text: "Sketchbook 10/01/25",
    imageUrl: 'assets/img/42.jpg'
 };

  samplePost2 = {
    user: {
      username: '@pandaz667',
      avatar: 'assets/img/pfp2.jpg'
    },
    timestamp: 'Hoy, 3:34 pm',
    text: "Dibujo del semestre pasado :p",
    imageUrl: 'assets/img/12.jpg'
 };

   samplePost3 = {
     user: {
       username: '@okayraynn',
       avatar: 'assets/img/pfp6.jpg'
     },
     timestamp: 'Hoy, 1:57 pm',
     text: "Different explorations of types of background and styles that i never posted! last semester's work hehe",
     imageUrl: 'assets/img/3.jpg'
  };

  samplePost4 = {
    user: {
      username: '@_ramitadequilo_',
      avatar: 'assets/img/pfp7.jpg'
    },
    timestamp: 'Ayer, 5:09 pm',
    text: 'Una Vizcacha que está chata.',
    imageUrl: 'assets/img/23.JPG'
  };


  posts = [this.samplePost1, this.samplePost2, this.samplePost3,  this.samplePost4];

  suggestedUsersData = [
    { username: '@remi_yai', avatar: 'assets/img/pfp5.jpg', name: 'レン' },
    { username: '@baadbored', avatar: 'assets/img/pfp8.jpg', name: 'BAAD' },
  ];

  trendingHashtagsData = [
    { tag: '#manga', count: '1 mill publicaciones', location: 'Tendencia en Chile' },
    { tag: '#sketch', count: '10 mil publicaciones', location: 'Tendencias' },
    { tag: '#gouache', count: '5 mil publicaciones', location: 'Tendencia en Chile' },
  ];

  constructor() { }

  ngOnInit() {

  }

}
