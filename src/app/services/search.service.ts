import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.service'; // Asegúrate de que la ruta a User sea correcta

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // Un "Subject" para guardar la lista de resultados
  private resultsSource = new BehaviorSubject<User[]>([]);
  // Un "Subject" para controlar si el desplegable se muestra o no
  private showSource = new BehaviorSubject<boolean>(false);

  // Hacemos públicos los "Subjects" como Observables para que otros puedan suscribirse
  public results$ = this.resultsSource.asObservable();
  public show$ = this.showSource.asObservable();

  constructor() { }

  // Método para actualizar la lista de resultados
  setResults(users: User[]) {
    this.resultsSource.next(users);
  }

  // Método para mostrar el desplegable
  show() {
    this.showSource.next(true);
  }

  // Método para ocultar el desplegable
  hide() {
    this.showSource.next(false);
  }
}