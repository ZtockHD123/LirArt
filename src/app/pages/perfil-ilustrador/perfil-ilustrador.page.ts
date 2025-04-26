// Ruta: src/app/pages/perfil-ilustrador/perfil-ilustrador.page.ts

import { Component, OnInit } from '@angular/core';

// Interfaz para el objeto Artist (Buena práctica)
interface Artist {
  name: string;
  profilePicUrl: string;
  bannerUrl: string;
  isVerified: boolean;
  sales: number;
  likes: number;
}

@Component({
  selector: 'app-perfil-ilustrador',
  templateUrl: './perfil-ilustrador.page.html',
  styleUrls: ['./perfil-ilustrador.page.scss'],
  standalone: false // Confirmado: standalone: false
})
export class PerfilILustradorPage implements OnInit {

  selectedView: 'portafolio' | 'productos' = 'portafolio';

  // --- Datos de Ejemplo ---
  artist: Artist = {
    name: '@okayraynn',
    profilePicUrl: 'assets/img/placeholders/profile-placeholder.png',
    bannerUrl: 'assets/img/placeholders/banner-placeholder.jpg',
    isVerified: true,
    sales: 562,
    likes: 1200
  };

  portfolioItems: { id: number, imageUrl: string, title?: string }[] = [
    { id: 1, imageUrl: 'assets/img/placeholders/portfolio1.jpg', title: 'Ilustración 1' },
    { id: 2, imageUrl: 'assets/img/placeholders/portfolio2.jpg', title: 'Ilustración 2' },
    { id: 3, imageUrl: 'assets/img/placeholders/portfolio3.jpg', title: 'Ilustración 3' },
    { id: 4, imageUrl: 'assets/img/placeholders/portfolio4.jpg', title: 'Ilustración 4' },
    { id: 5, imageUrl: 'assets/img/placeholders/portfolio5.jpg', title: 'Ilustración 5' },
    { id: 6, imageUrl: 'assets/img/placeholders/portfolio6.jpg', title: 'Ilustración 6' },
    { id: 7, imageUrl: 'assets/img/placeholders/portfolio1.jpg', title: 'Ilustración 7' },
    { id: 8, imageUrl: 'assets/img/placeholders/portfolio2.jpg', title: 'Ilustración 8' },
  ];
  productItems: { id: number, imageUrl: string, title?: string, price?: number }[] = [
    { id: 101, imageUrl: 'assets/img/placeholders/product1.jpg', title: 'Libro de Arte', price: 25.00 },
    { id: 102, imageUrl: 'assets/img/placeholders/product2.jpg', title: 'Set de Prints', price: 15.50 },
    { id: 103, imageUrl: 'assets/img/placeholders/product3.jpg', title: 'Stickers Pack', price: 8.00 },
    { id: 104, imageUrl: 'assets/img/placeholders/product4.jpg', title: 'Camiseta Diseño Exclusivo', price: 30.00 },
    { id: 105, imageUrl: 'assets/img/placeholders/product1.jpg', title: 'Libro Firmado', price: 40.00 },
  ];

  // *** NOVEDADES AMPLIADAS PARA TEST SCROLL ***
  novedadesItems: { user: string, time: string, text: string, avatar: string }[] = [
    { user: 'System', time: 'Hoy a las 14:00', text: '¡Nueva comisión abierta!', avatar: 'assets/img/placeholders/avatar1.png'},
    { user: 'System', time: 'Hoy a las 13:00', text: 'Nuevo dibujo hoy a las 13:00', avatar: 'assets/img/placeholders/avatar2.png'},
    { user: 'System', time: 'Ayer', text: '¿Creen que uso buenas paletas de colores?', avatar: 'assets/img/placeholders/avatar3.png'},
    { user: 'System', time: 'Hace 2 días', text: '¿Qué opinan del último cómic?', avatar: 'assets/img/placeholders/avatar1.png'},
    { user: 'System', time: 'Hace 3 días', text: 'Tutorial de sombreado pronto...', avatar: 'assets/img/placeholders/avatar2.png'},
    { user: 'System', time: 'Hace 4 días', text: 'Stream de dibujo esta noche.', avatar: 'assets/img/placeholders/avatar3.png'},
    { user: 'System', time: 'Hace 5 días', text: 'Recordatorio: Concurso activo.', avatar: 'assets/img/placeholders/avatar1.png'},
    { user: 'System', time: 'Hace 6 días', text: 'Gracias por los 1000 seguidores!', avatar: 'assets/img/placeholders/avatar2.png'},
    // --- Items Adicionales ---
    { user: 'System', time: 'Hace 1 semana', text: 'Revisando portfolio antiguo...', avatar: 'assets/img/placeholders/avatar3.png'},
    { user: 'System', time: 'Hace 1 semana', text: 'Próximo personaje: diseño conceptual.', avatar: 'assets/img/placeholders/avatar1.png'},
    { user: 'System', time: 'Hace 1 semana', text: 'Inspiración encontrada en la naturaleza.', avatar: 'assets/img/placeholders/avatar2.png'},
    { user: 'System', time: 'Hace 2 semanas', text: 'Planificando el mes de trabajo.', avatar: 'assets/img/placeholders/avatar3.png'},
  ];
  // *** FIN NOVEDADES AMPLIADAS ***

  // *** COMENTARIOS AMPLIADOS PARA TEST SCROLL ***
  comentariosItems: { user: string, handle: string, text: string, avatar: string }[] = [
     { user: 'Panda', handle: '@pandaArt', text: 'Me encanta esta cuenta!', avatar: 'assets/img/placeholders/avatar-panda.png'},
     { user: 'Estela', handle: '@estrellaFugaz', text: 'Me fascinan los ocs que tiene.', avatar: 'assets/img/placeholders/avatar-estela.png'},
     { user: 'BÚHO', handle: '@buhoNocturno', text: 'Quiero más historias de Jack', avatar: 'assets/img/placeholders/avatar-buho.png'},
     { user: 'GatoNauta', handle: '@spaceCat', text: 'Los colores son increíbles!', avatar: 'assets/img/placeholders/avatar1.png'},
     { user: 'LectorX', handle: '@comicFan', text: '¿Cuándo sale el próximo capítulo?', avatar: 'assets/img/placeholders/avatar2.png'},
     { user: 'ArteFan', handle: '@dailyArt', text: 'Siempre inspirador.', avatar: 'assets/img/placeholders/avatar3.png'},
     { user: 'CriticoConstructivo', handle: '@feedbackGuy', text: 'La anatomía en el último dibujo podría mejorar un poco.', avatar: 'assets/img/placeholders/avatar-panda.png'},
     { user: 'Fan #1', handle: '@superFan', text: '¡Eres el mejor!', avatar: 'assets/img/placeholders/avatar-estela.png'},
     { user: 'Pregunton', handle: '@asky', text: '¿Qué programa usas para dibujar?', avatar: 'assets/img/placeholders/avatar-buho.png'},
     { user: 'ColegaArtista', handle: '@drawFellow', text: '¡Buen trabajo!', avatar: 'assets/img/placeholders/avatar1.png'},
     // --- Items Adicionales ---
     { user: 'NuevoSeguidor', handle: '@newbie', text: 'Acabo de descubrir tu arte, ¡es genial!', avatar: 'assets/img/placeholders/avatar2.png'},
     { user: 'Detallista', handle: '@pixelPeep', text: 'Me fijo mucho en los detalles de fondo, ¡qué nivel!', avatar: 'assets/img/placeholders/avatar3.png'},
     { user: 'Observador', handle: '@watcher', text: 'La evolución desde tus primeros trabajos es notable.', avatar: 'assets/img/placeholders/avatar-panda.png'},
     { user: 'Animador', handle: '@cheerleader', text: '¡Sigue así, no pares!', avatar: 'assets/img/placeholders/avatar-estela.png'},
     { user: 'OtroFan', handle: '@fanFromAfar', text: 'Saludos desde lejos, admiro tu trabajo.', avatar: 'assets/img/placeholders/avatar-buho.png'},
   ];
  // *** FIN COMENTARIOS AMPLIADOS ***

  // --- Fin Datos de Ejemplo ---

  constructor() { }

  ngOnInit() { }

  handleSegmentChange(event: Event) {
    const segmentValue = (event as CustomEvent).detail.value;
    if (segmentValue === 'portafolio' || segmentValue === 'productos') {
      this.selectView(segmentValue);
    } else {
      console.warn('Valor de segmento inesperado recibido:', segmentValue);
    }
  }

  selectView(view: 'portafolio' | 'productos') {
    this.selectedView = view;
    console.log('Vista seleccionada:', this.selectedView);
  }

  // --- Otros Métodos ---
  followArtist() { console.log('Seguir al artista:', this.artist.name); }
  sendMessage() { console.log('Enviar mensaje al artista:', this.artist.name); }
  viewPortfolioItem(item: any) { console.log('Viendo item portafolio:', item.id); }
  viewProductItem(item: any) { console.log('Viendo item producto:', item.id); }

} // <- Llave de cierre de la clase