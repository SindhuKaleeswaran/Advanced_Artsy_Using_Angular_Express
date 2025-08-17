import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../user.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { NotificationsService } from '../services/notifications.service';
import { Router } from '@angular/router';
import { ArtistDetailService } from '../artist-detail.service';

interface Artist {
  id: string;
  name: string;
  birthday: string;
  deathday: string;
  nationality: string;
  thumbnail: string;
}
@Component({
  selector: 'app-favourites',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit, OnDestroy {
  favourites: { artistId: string, addedAt: string }[] = [];
  aptArtistID: string = "http://localhost:3000/artist_id";
  favArtists: any[] = [];
  username: string = '';
  defaultImage = "artsy_logo.svg";
  timers: { [key: string]: any } = {}; 
  noFavsFound: boolean = false;
  isLoading: boolean = false;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationsService,
    private router: Router,
    private artistDetailService: ArtistDetailService 
  ) {}

  ngOnInit() {
    const favs = this.cookieService.get("fav");

    if (favs) {
      const parsedFavs = JSON.parse(favs);

      this.favourites = parsedFavs
        .filter((fav: any) => typeof fav === 'object' && fav.artistId && fav.addedAt)
        .map((fav: any) => ({
          artistId: fav.artistId,
          addedAt: fav.addedAt
        }));

        this.noFavsFound = this.favourites.length === 0;

      this.cookieService.set('fav', JSON.stringify(this.favourites));

      this.artistDisplay();
    }

    this.authService.username$.subscribe((name) => {
      this.username = name;
    });
  }

  setDefaultImage(event: any) {
    event.target.src = this.defaultImage;
  }

  navigateToArtistDetails(artistId: string) {
    this.artistDetailService.setArtistId(artistId);
    this.router.navigate(['/']);
  }

  async artistDisplay() {
    this.favArtists = [];
    if (this.favourites.length === 0) {
      this.isLoading = false;
      return;
    }

    for (const fav of this.favourites) {
      try {
        const artistDetail = await this.callFavs(fav.artistId);
        this.favArtists.push({
          id: fav.artistId,
          name: artistDetail.artistName,
          birthday: artistDetail.birthday,
          deathday: artistDetail.deathday,
          nationality: artistDetail.nationality,
          thumbnail: artistDetail.thumbnail,
          addedAt: fav.addedAt,
          timer: this.calculateTimeAgo(fav.addedAt)
        });
        this.startTimer(fav.artistId);
        
      } catch (error) {
        console.error("Error fetching artist details:", error);
      }
      this.favArtists.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
      this.isLoading = false; 
    }
  }

  callFavs(artistId: string) {
    return this.http.get<any>(`${this.aptArtistID}?artistID=${artistId}`).toPromise();
  }

  onRemove(artist_id: string) {
    this.notificationService.showNotification('Removed from favorites', 'danger');
    const requestBody = {
      emailID: this.username,
      artistID: artist_id,
      flag: 0
    };
    const token = this.cookieService.get('jwtoken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.noFavsFound = false;
    this.http.post('http://localhost:3000/fav', requestBody, { headers })
      .subscribe(response => {
        let currentFavourites = JSON.parse(this.cookieService.get('fav') || '[]');
        
        currentFavourites = currentFavourites.filter((fav: any) =>
          typeof fav === 'object' && fav.artistId !== artist_id
        );

        this.cookieService.set('fav', JSON.stringify(currentFavourites));
        this.favourites = currentFavourites;
        this.favArtists = this.favArtists.filter((artist: any) => artist.id !== artist_id);

        if (this.timers[artist_id]) {
          clearInterval(this.timers[artist_id]);
          delete this.timers[artist_id];
        }

        //alert('Artist removed from favourites!');
      }, error => {
        console.error('Error updating favourite status:', error);
      });
  }

  calculateTimeAgo(addedAt: string): string {
    const now = new Date();
    const addedTime = new Date(addedAt);
    const diffInSeconds = Math.floor((now.getTime() - addedTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;  // For seconds
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;  // For minutes
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;  // For hours
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;  // For days
    }
  }

  startTimer(artistId: string) {
    this.timers[artistId] = setInterval(() => {
      const artistIndex = this.favArtists.findIndex(artist => artist.id === artistId);
      if (artistIndex > -1) {
        this.favArtists[artistIndex].timer = this.calculateTimeAgo(this.favArtists[artistIndex].addedAt);
      }
    }, 1000);
  }

  ngOnDestroy() {
    Object.values(this.timers).forEach(clearInterval);
  }
}