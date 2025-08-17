import { Component,OnInit } from '@angular/core';
import { ArtistDetailService } from '../artist-detail.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { CookieService } from 'ngx-cookie-service';
import { FavouritesService } from '../services/favourites.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-artist-info',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './artist-info.component.html',
  styleUrl: './artist-info.component.css'
})
export class ArtistInfoComponent implements OnInit {
  artistId: string | null = null;
  aptArtistID: string = "http://localhost:3000/artist_id";
  artistDetail: any = {};
  isLoggedIn: boolean = false;
  favourites: any[] = [];
  username: string = '';
  isLoading: boolean = false;
  selectedSimilarArtistId: string | null = null;

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private artistService: ArtistDetailService,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private favouritesService: FavouritesService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.favouritesService.favourites$.subscribe(favs => {
      this.favourites = favs;
      if (this.artistId) {
        this.artistDetailDisplay(this.artistId);
      }
    });

    this.artistService.artistId$.subscribe((id) => {
      console.log("Received Artist ID in Info Component:", id);
      this.artistId = id;
      if (this.artistId) {
        this.artistDetailDisplay(this.artistId);
      }
    });

    this.authService.username$.subscribe((name) => {
      this.username = name;
    });
  }

  defaultImage = "artsy_logo.svg";
  setDefaultImage(event: any) {
    event.target.src = this.defaultImage;
  }

  artistDetailDisplay(artistId: string) {
    this.isLoading=true;
    this.http.get<any>(`${this.aptArtistID}?artistID=${artistId}`).subscribe(
      (response) => {
        const isMainArtistFavourite = this.checkIfFavourite(artistId);
        this.isLoading=false;

        const updatedSimilarArtists = response.similarArtists?.map((artist: any) => ({
          ...artist,
          isFavourite: this.checkIfFavourite(artist.id)
        })) || [];

        this.artistDetail = {
          ...response,
          isFavourite: isMainArtistFavourite,
          similarArtists: updatedSimilarArtists,
          id: artistId
        };

        console.log("Artist received with favourite status:", this.artistDetail);
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error("Error fetching artist details:", error);
      }
    );
  }

  checkIfFavourite(artistId: string): boolean{
    return this.favourites.some(fav => fav.artistId === artistId);
  }

  onClickFav(artist: any){
    console.log("testuuu",artist);
    artist.isFavourite = !artist.isFavourite;
    this.updateFavouriteStatus(artist);
    this.cdRef.detectChanges();
  }

  updateFavouriteStatus(artist: any){
    const flag = artist.isFavourite ? 1 : 0;

    const requestBody = {
      emailID: this.username,
      artistID: artist.id,
      flag: flag
    };

    const token = this.cookieService.get('jwtoken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:3000/fav', requestBody, { headers })
      .subscribe(response => {
        let currentFavourites = [...this.favourites];

        if(artist.isFavourite){
          if (!currentFavourites.some(fav => fav.artistId === artist.id)) {
            currentFavourites.push({
              artistId: artist.id,
              addedAt: new Date().toISOString()
            });
          }
        }else{
          currentFavourites = currentFavourites.filter(fav => fav.artistId !== artist.id);
        }

        this.favouritesService.updateFavourites(currentFavourites);
      }, error => {
        console.error('Error updating favourite status:', error);
      });
  }

  updateArtistId(artistId: string) {
    this.selectedSimilarArtistId = artistId;
    this.artistService.setArtistId(artistId);
  }
}
