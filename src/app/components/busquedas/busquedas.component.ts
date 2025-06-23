import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { User } from '../../services/user.service';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styleUrls: ['./busquedas.component.scss'],
  standalone: false
})
export class BusquedasComponent implements OnInit {

  show$: Observable<boolean>;
  results$: Observable<User[]>;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {
    this.show$ = this.searchService.show$;
    this.results$ = this.searchService.results$;
  }

  ngOnInit() {}

  goToProfile(user: User) {
    const route = user.type === 'ilustrador' ? '/perfil-ilustrador' : '/perfil-cliente';
    this.router.navigate([route]);
    // Ocultamos los resultados después de hacer clic
    this.searchService.hide();
  }
}