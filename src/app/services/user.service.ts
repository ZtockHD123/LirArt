import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interfaz para definir la estructura de un usuario
export interface User {
  id: number;
  username: string;
  type: 'ilustrador' | 'cliente';
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Lista de usuarios de prueba. En una app real, vendrían de una API.
  private allUsers: User[] = [
    { id: 1, username: '@frantoppp', type: 'cliente', avatar: 'assets/img/pfp3.jpg' },
    { id: 2, username: '@pandaz667', type: 'ilustrador', avatar: 'assets/img/pfp2.jpg' },
  
  ];

  constructor() { }

  /**
   * Busca usuarios cuyo nombre de usuario coincida con el término de búsqueda.
   * @param query El término a buscar.
   * @returns Un Observable con un array de usuarios coincidentes.
   */
  searchUsers(query: string): Observable<User[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }
    const filteredUsers = this.allUsers.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    // Simulamos un pequeño retraso de red
    return of(filteredUsers).pipe(delay(250));
  }
}