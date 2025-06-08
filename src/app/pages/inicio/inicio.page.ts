import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {

  loginData = {
    correo: '',
    contrasena: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
  }

  login() {
    console.log('Enviando datos de login:', this.loginData);
    this.authService.login(this.loginData).subscribe(
      res => {
        console.log('Login exitoso!', res);
        alert('¡Inicio de sesión exitoso!');
        // Navega al menú principal
        this.router.navigateByUrl('/menu');
      },
      err => {
        console.error('Error en el login:', err);
        alert(`Error: ${err.error.message || 'No se pudo iniciar sesión'}`);
      }
    );
  }

  forgotPassword() {
    console.log('Enlace Olvidé Contraseña presionado');
  }

  register() {
    console.log('Enlace Registrarse presionado - Navegando a /registro');
    this.router.navigateByUrl('/registro');
  }
}