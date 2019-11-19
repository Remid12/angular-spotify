import { Component, OnInit, EventEmitter } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  infos;
  topArtists;
  selectTime = 'short_term';

  constructor(private spotifyService: SpotifyService, private router: Router) {
    this.spotifyService.profile().subscribe((data) => {
      this.infos = data;
    }, error => {
      this.router.navigateByUrl('/');
    });

    this.spotifyService.topArtists('').subscribe((data) => {
      this.topArtists = data;
    });
  }

  ngOnInit() {


  }

  changeTime(e) {
    this.spotifyService.topArtists(e.value).subscribe((data) => {
      this.topArtists = data;
    });
  }
}


