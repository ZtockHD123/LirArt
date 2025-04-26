import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {

  @Input() userProfileImageUrl: string | null = null;
  @Input() cartItemCount: number = 0;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  goToHome() {
    console.log('Ir a Home');
    this.router.navigateByUrl('/menu');
  }

  onSearchChange(event: any) {
    const searchTerm = event.detail.value;
    console.log('Término de búsqueda:', searchTerm);
  }

  goToCart() {
    console.log('Ir al Carrito');
    this.router.navigateByUrl('/carrito');
  }

  goToProfile() {
    console.log('Ir al Perfil');
    this.router.navigateByUrl('/perfil-cliente');
  }
}
