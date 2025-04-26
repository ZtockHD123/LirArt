import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggested-users',
  templateUrl: './suggested-users.component.html',
  styleUrls: ['./suggested-users.component.scss'],
  standalone: false
})
export class SuggestedUsersComponent implements OnInit {

  @Input() suggestedUsers: any[] = [];

  constructor() { }

  ngOnInit() {}

  followUser(user: any) {
    console.log('Intentando seguir a:', user.username);
  }
}
