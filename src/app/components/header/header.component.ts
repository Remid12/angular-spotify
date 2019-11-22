import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from "@angular/router";
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private spotifyService: SpotifyService, private router: Router) { }

  isLogged = false;

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLogged = this.spotifyService.isLogged();
      }
    });
  }

}
