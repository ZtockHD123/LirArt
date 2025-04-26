import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: false
})
export class PostCardComponent implements OnInit {

  @Input() postData: any;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  goToProfileIlustrator(){
    console.log('Ir a perfil Ilustrador');
    this.router.navigateByUrl('/perfil-ilustrador')
  }
}
