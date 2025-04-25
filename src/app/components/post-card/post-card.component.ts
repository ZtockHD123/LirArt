import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router para navegación

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: false
})
export class PostCardComponent implements OnInit {

  // @Input() permite que el componente padre (MenuPage) pase datos a este componente
  @Input() postData: any; // Define una interfaz más específica si es posible

  constructor(private router: Router) { }

  ngOnInit() {
    // Puedes añadir lógica aquí si es necesario al iniciar el componente
    // if (!this.postData) {
    //   console.error('PostCardComponent: No postData provided!');
    // }
  }

  goToProfileIlustrator(){
    console.log('Ir a perfil Ilustrador');
    // Cambia '/menu' por la ruta correcta de tu página principal si es diferente
    this.router.navigateByUrl('/perfil-ilustrador')
  }
}
