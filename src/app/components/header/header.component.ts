import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router para navegación

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {

  // Input para recibir la URL de la imagen de perfil (o usar un servicio)
  @Input() userProfileImageUrl: string | null = null; // Inicialmente null
  // Input o variable para el contador del carrito (opcional)
  @Input() cartItemCount: number = 0;

  // Inyecta Router en el constructor
  constructor(private router: Router) { }

  ngOnInit() {
    // Aquí podrías obtener la URL de la imagen de perfil desde un servicio de autenticación/usuario
    // this.userProfileImageUrl = this.authService.getUserProfilePic();
    // this.cartItemCount = this.cartService.getItemCount();
  }

  goToHome() {
    console.log('Ir a Home');
    // Cambia '/menu' por la ruta correcta de tu página principal si es diferente
    this.router.navigateByUrl('/menu');
  }

  onSearchChange(event: any) {
    const searchTerm = event.detail.value;
    console.log('Término de búsqueda:', searchTerm);
    // Aquí implementarías la lógica de búsqueda (filtrar resultados, navegar a página de búsqueda, etc.)
  }

  goToCart() {
    console.log('Ir al Carrito');
    this.router.navigateByUrl('/carrito'); // Navega a la página del carrito
  }

  goToProfile() {
    console.log('Ir al Perfil');
    // Navega a la página de perfil del usuario (asegúrate que la ruta sea correcta)
    this.router.navigateByUrl('/perfil-cliente'); // O '/perfil-ilustrador' según el rol
  }
}
