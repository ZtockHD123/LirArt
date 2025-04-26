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
    name: '@pandaz667',
    profilePicUrl: 'assets/img/pfp2.jpg',
    bannerUrl: 'assets/img/34.jpg',
    isVerified: true,
    sales: 562,
    likes: 1200
  };

  portfolioItems: { id: number, imageUrl: string, title?: string }[] = [
    { id: 1, imageUrl: 'assets/img/12.jpg', title: 'Ilustración 1' },
    { id: 2, imageUrl: 'assets/img/14.jpg', title: 'Ilustración 2' },
    { id: 3, imageUrl: 'assets/img/33.png', title: 'Ilustración 3' },
    { id: 4, imageUrl: 'assets/img/31.png', title: 'Ilustración 4' },
    { id: 5, imageUrl: 'assets/img/32.png', title: 'Ilustración 5' },
    { id: 6, imageUrl: 'assets/img/45.jpg', title: 'Ilustración 6' },
    { id: 7, imageUrl: 'assets/img/43.jpg', title: 'Ilustración 7' },
    { id: 8, imageUrl: 'assets/img/42.jpg', title: 'Ilustración 8' },
  ];
  productItems: { id: number, imageUrl: string, title?: string, price?: number }[] = [
    { id: 101, imageUrl: 'assets/img/ventas1.jpg', title: 'Libro de Arte', price: 25000 },
    { id: 102, imageUrl: 'assets/img/29.png', title: 'Set de Prints', price: 15500 },
    { id: 103, imageUrl: 'assets/img/ventas7.png', title: 'Stickers Pack', price: 8000 },
    { id: 104, imageUrl: 'assets/img/ventas8.jpg', title: 'Camiseta Diseño Exclusivo', price: 30000 },
    { id: 105, imageUrl: 'assets/img/ventas9.jpg', title: 'Libro Firmado', price: 40000 },
  ];

  // *** NOVEDADES AMPLIADAS PARA TEST SCROLL ***
  novedadesItems: { user: string, time: string, text: string, avatar: string }[] = [
    { user: 'System', time: 'Hoy a las 14:00', text: '¡Nueva comisión abierta!', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hoy a las 13:00', text: 'Nuevo dibujo hoy a las 13:00', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Ayer', text: '¿Creen que uso buenas paletas de colores?', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hace 2 días', text: '¿Qué opinan del último cómic?', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hace 3 días', text: 'Tutorial de sombreado pronto...', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hace 4 días', text: 'Stream de dibujo esta noche.', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hace 5 días', text: 'Recordatorio: Concurso activo.', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hace 6 días', text: 'Gracias por los 1000 seguidores!', avatar: 'assets/img/pfp2.jpg'},
    // --- Items Adicionales ---
    { user: 'System', time: 'Hace 1 semana', text: 'Revisando portfolio antiguo...', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hace 1 semana', text: 'Próximo personaje: diseño conceptual.', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hace 1 semana', text: 'Inspiración encontrada en la naturaleza.', avatar: 'assets/img/pfp2.jpg'},
    { user: 'System', time: 'Hace 2 semanas', text: 'Planificando el mes de trabajo.', avatar: 'assets/img/pfp2.jpg'},
  ];
  // *** FIN NOVEDADES AMPLIADAS ***

  // *** COMENTARIOS AMPLIADOS PARA TEST SCROLL ***
  comentariosItems: { user: string, handle: string, text: string, avatar: string }[] = [
     { user: 'Pauly Ilustra', handle: '@_ramitadequilo_', text: 'Me encanta esta cuenta!', avatar: 'assets/img/pfp7.jpg'},
     { user: 'Estela', handle: '@coleoptera.ilus', text: 'Me fascinan los ocs que tiene.', avatar: 'assets/img/pfp4.jpg'},
     { user: 'BÚHO', handle: '@buho_lunart', text: 'Quiero más historias', avatar: 'assets/img/pfp3.jpg'},
     { user: 'Ray', handle: '@okayraynn', text: 'Los colores son increíbles!', avatar: 'assets/img/pfp6.jpg'},
     { user: 'レン', handle: '@remi_yai', text: '¿Cuándo sale el próximo capítulo?', avatar: 'assets/img/pfp5.jpg'},
     { user: 'BAAD', handle: '@baadbored', text: 'Siempre inspirador.', avatar: 'assets/img/pfp8.jpg'},
     { user: 'rata 🐁💐', handle: '@medicenrata', text: 'La anatomía en el último dibujo podría mejorar un poco.', avatar: 'assets/img/pfp1.jpg'},
     { user: 'Fan #1', handle: '@superFan', text: '¡Eres el mejor!', avatar: 'assets/img/pfp9.png'},
     { user: 'Pregunton', handle: '@asky', text: '¿Qué programa usas para dibujar?', avatar: 'assets/img/pfp10.png'},
     { user: 'ColegaArtista', handle: '@drawFellow', text: '¡Buen trabajo!', avatar: 'assets/img/pfp11.jpg'},
     // --- Items Adicionales ---
     { user: 'NuevoSeguidor', handle: '@newbie', text: 'Acabo de descubrir tu arte, ¡es genial!', avatar: 'assets/img/pfp12.png'},
     { user: 'Detallista', handle: '@pixelPeep', text: 'Me fijo mucho en los detalles de fondo, ¡qué nivel!', avatar: 'assets/img/pfp13.jpg'},
     { user: 'Observador', handle: '@watcher', text: 'La evolución desde tus primeros trabajos es notable.', avatar: 'assets/img/pfp14.png'},
     { user: 'PANXO', handle: '@p.e.j_art', text: '¡Sigue así, no pares!', avatar: 'assets/img/pfp15.jpg'},
     { user: 'Danny Martínez 💫', handle: '@dannypmr2004', text: 'Saludos desde lejos, admiro tu trabajo.', avatar: 'assets/img/pfp16.jpg'},
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