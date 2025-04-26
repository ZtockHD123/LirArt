import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
  }

  login() {
    console.log('Botón Acceder presionado');
    this.router.navigateByUrl('/menu');
  }

  forgotPassword() {
    console.log('Enlace Olvidé Contraseña presionado');
  }

  register() {
    console.log('Enlace Registrarse presionado - Navegando a /registro');
    this.router.navigateByUrl('/registro');
  }
}
