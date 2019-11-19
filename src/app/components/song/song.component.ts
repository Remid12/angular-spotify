import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  song;
  details;
  objectKeys = Object.keys;

  constructor(private spotifyService: SpotifyService, private router: Router) { }

  ngOnInit() {
    this.fetchSong();
  }

  fetchSong() {
    this.spotifyService.song('1MJ5f5EYBC92ADD6xcz7nb').subscribe((data) => {
      this.song = data;
    }, error => {
      console.log(error);
      //this.router.navigateByUrl('/');
    });

    this.spotifyService.songDetails('1MJ5f5EYBC92ADD6xcz7nb').subscribe((data) => {
      this.details = data;
      console.log(this.details);
    });
  }

}
