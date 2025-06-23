import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.page.html',
  styleUrls: ['./perfil-cliente.page.scss'],
  standalone: false
})
export class PerfilClientePage implements OnInit {

  user = {
    username: '@frantoppp',
    avatarUrl: 'assets/img/pfp3.jpg',
    bannerUrl: 'assets/img/3.jpg',
    isVerified: true,
    rating: 5
  };

  actionItems = [
    { icon: 'bag-handle-outline', label: 'Historial de Compras' },
    { icon: 'timer-outline', label: 'Comisiones Pendientes' },
    { icon: 'card-outline', label: 'Pendientes de pago' },
    { icon: 'create-outline', label: 'Añadir reseña' },
    { icon: 'close-circle-outline', label: 'Comisiones canceladas' }
  ];

  savedItems = [
    { imageUrl: 'assets/img/40.jpg' },
    { imageUrl: 'assets/img/ventas1.jpg' },
    { imageUrl: 'assets/img/12.jpg' },
    { imageUrl: 'assets/img/14.jpg' },
  ];
  
  stars: number[] = [];

  constructor() { }

  ngOnInit() {
    this.stars = Array(this.user.rating).fill(0);
  }

  editProfile() {
    console.log('Edit Profile clicked');
  }

  shareProfile() {
    console.log('Share Profile clicked');
  }

  onActionClick(actionLabel: string) {
    console.log(`${actionLabel} clicked`);
  }
}