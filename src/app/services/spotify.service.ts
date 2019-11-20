import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Router } from "@angular/router";

import * as qs from 'qs';
import { map } from 'rxjs/operators';

import { AudioFeatures } from '../interfaces/audio-features';

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  constructor(private http: HttpClient, private router: Router) { }

  private clientId = '011e93492c4942529eb2c2d7f91dcd8d';
  private songsList = [];

  //Ask user to login (spotify redirection)
  login() {
    const params = {
      response_type: 'token',
      client_id: this.clientId,
      redirect_uri: `http://${window.location.host}/login`,
      scope: 'streaming user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read user-read-recently-played',
      show_dialog: true
    }

    const redirectUrl = `https://accounts.spotify.com/authorize?${qs.stringify(params)}`;
    window.location.href = redirectUrl;
  }

  isLogged() {
    console.log(localStorage.getItem('authToken'));
  }

  //Check if Auth token is correct
  loginVerification() {
    if (window.location.hash === null || window.location.hash === '') {
      this.router.navigateByUrl('/');
    } else {
      const url = window.location.hash.substr(1).split('=');
      const token = url[1].split('&')[0];

      localStorage.setItem('authToken', token);
      this.router.navigateByUrl('/profile');
    }

  }
  //User informations (name, email...)
  profile() {
    return this.http.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
  }

  //Get Users top artists with custom duration
  topArtists(customDuration) {
    const duration = (customDuration != '') ? customDuration : 'short_term';

    return this.http.get(`https://api.spotify.com/v1/me/top/artists?time_range=${duration}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
  }

  song(id) {
    return this.http.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
  }

  //Fetch latest songs ids
  latestSongs() {
    return this.http.get(`https://api.spotify.com/v1/me/player/recently-played?type=track&limit=50`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    }).pipe(map(response => {
      //We store all on latest tracks IDs
      response.items.forEach(song => {
        this.songsList.push(song.track.id);
      });

      //New request to get the datas of these IDs
      return this.songsList.toString();
    }))
  }

  //Send all latest songs datas
  latestSongsData(ids) {
    return this.http.get(`https://api.spotify.com/v1/audio-features/?ids=${ids}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    }).pipe(map(response => {
      const items = response.audio_features;
      const total = items.length;

      //Danceable?
      let danceability = 0;
      //Fast loud and noisy
      let energy = 0;
      //Happy?
      let valence = 0;
      let speechiness = 0;

      let happinessValues = [];

      items.forEach((infos) => {
        danceability += infos.danceability;
        energy += infos.energy;
        valence += infos.valence;
        speechiness += infos.speechiness;

        happinessValues.push(infos.valence);
      });

      const leastHappy = Math.min.apply(Math, happinessValues);
      const leastHappyId = items.find(o => o.valence === leastHappy).id;
      const mostHappy = Math.max.apply(Math, happinessValues);
      const mostHappyId = items.find(o => o.valence === mostHappy).id;


      let datas = {
        danceability: Math.round((danceability / total) * 100),
        energy: Math.round((energy / total) * 100),
        valence: Math.round((valence / total) * 100),
        speechiness: Math.round((speechiness / total) * 100),
        leastHappy: leastHappyId,
        mostHappy: mostHappyId,
      };

      return datas;
    }));
  }
}