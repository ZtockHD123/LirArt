import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trending-hashtags',
  templateUrl: './trending-hashtags.component.html',
  styleUrls: ['./trending-hashtags.component.scss'],
  standalone: false
})
export class TrendingHashtagsComponent implements OnInit {

  @Input() hashtags: any[] = [];

  constructor() { }

  ngOnInit() {}

  searchHashtag(tag: string) {
    console.log('Navegar o buscar el hashtag:', tag);
    // Aquí iría la lógica para buscar publicaciones con ese hashtag
  }
}
