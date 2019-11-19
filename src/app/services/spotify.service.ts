import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Router } from "@angular/router";

import * as qs from 'qs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  constructor(private http: HttpClient, private router: Router) { }

  clientId = '011e93492c4942529eb2c2d7f91dcd8d';


  login() {
    const params = {
      response_type: 'token',
      client_id: this.clientId,
      redirect_uri: `http://${window.location.host}/login`,
      scope: 'streaming user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read',
      show_dialog: true
    }

    const redirectUrl = `https://accounts.spotify.com/authorize?${qs.stringify(params)}`;
    window.location.href = redirectUrl;
  }

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

  profile() {
    return this.http.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
  }

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

  songDetails(id) {
    return this.http.get(`https://api.spotify.com/v1/audio-features/${id}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
  }
}