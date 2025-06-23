import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service'; // <-- Importa el nuevo servicio
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {

  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  // Inyecta SearchService aquí
  constructor(
    private userService: UserService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.searchUsers(term)),
    ).subscribe(users => {
      // En lugar de guardar los resultados aquí, se los pasamos al servicio
      this.searchService.setResults(users);
      if (this.searchQuery.length > 0 && users.length > 0) {
        this.searchService.show();
      } else {
        this.searchService.hide();
      }
    });
  }

  onSearch(event: any) {
    const term = event.target.value;
    this.searchQuery = term;
    this.searchTerms.next(term);
    if (!term.trim()) {
      this.searchService.hide();
    }
  }

  onBlur() {
    // Usamos un timeout para dar tiempo a hacer clic en un resultado
    setTimeout(() => {
      this.searchService.hide();
    }, 200);
  }
}