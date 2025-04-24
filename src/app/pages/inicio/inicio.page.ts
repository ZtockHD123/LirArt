import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})

export class InicioPage implements OnInit {

  ngOnInit() {
  }

  login() {
    console.log('Botón Acceder presionado');

  }

  forgotPassword() {
    console.log('Enlace Olvidé Contraseña presionado');
  }

  register() {
    console.log('Enlace Registrarse presionado - Navegando a /tabs/tab2');
  }
}
