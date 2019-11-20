import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  songHappy;
  songSad;
  percent;


  constructor(private spotifyService: SpotifyService, private router: Router) { }

  ngOnInit() {
    this.getSongsData();
  }

  fetchSong(id, isHappy) {
    this.spotifyService.song(id).subscribe((data) => {
      if (isHappy) {
        this.songHappy = data;
      } else {
        this.songSad = data;
      }

    }, error => {
      console.log(error);
    });
  }

  getSongsData() {
    this.spotifyService.latestSongs().subscribe(ids => {
      this.spotifyService.latestSongsData(ids).subscribe(data => {
        //store all songs datas
        this.percent = data;

        this.fetchSong(data.leastHappy, false);
        this.fetchSong(data.mostHappy, true);
      });
    })
  }
}
