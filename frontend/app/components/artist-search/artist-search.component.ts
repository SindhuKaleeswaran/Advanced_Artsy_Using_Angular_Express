import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistInfoComponent } from '../artist-info/artist-info.component';
import { ArtistDetailService } from '../artist-detail.service';
import { ArtistWorksComponent } from '../artist-works/artist-works.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FavouritesService } from '../services/favourites.service';
import { UserService } from '../../user.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';
import { NotificationsService } from '../services/notifications.service';


@Component({
  selector: 'app-artist-search',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, ArtistInfoComponent, ArtistWorksComponent, RouterOutlet,RouterLink],
  templateUrl: './artist-search.component.html',
  styleUrl: './artist-search.component.css'
})

export class ArtistSearchComponent {
  artistName: string = "";
  artists: any[] = [];
  apiArtistSearch: string = "http://localhost:3000/search";
  artistDetail: any = {};
  options: string = "artistDetails";
  selectedArtistID: string | null = null;
  noArtistsFound: boolean = false;
  isLoggedIn: boolean = false;
  selectedUsername: string | null = null;
  userProfile: any;
  username: string = '';
  favourites: { artistId: string, addedAt: string }[] = [];  // Use this structure for favourites
  searchText: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient, private cdRef: ChangeDetectorRef, 
    private artistService: ArtistDetailService, private authService: AuthService, 
    private route: ActivatedRoute, private router: Router,
    private favouritesService: FavouritesService, private userService: UserService,
    private cookieService: CookieService, private notificationService: NotificationsService
  ) { 
    console.log(this.artistName);
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    // Initialize favourites list from cookies
    //this.loadFavourites();

    this.route.paramMap.subscribe(params => {
      this.selectedArtistID = params.get('artistId') || "";
      if (this.selectedArtistID) {
        this.artistInfo(this.selectedArtistID);
      }
    });

    this.artistService.artistId$.subscribe(artistId => {
      if (artistId) {
        this.selectedArtistID = artistId; // Update selectedArtistID
        this.fetchArtistDetails(artistId); // Call fetchArtistDetails with artistId
      }
    });

    this.authService.username$.subscribe((name) => {
      this.username = name;
    });

    this.favouritesService.favourites$.subscribe(favs => {
      this.favourites = favs;
      this.artists.forEach(artist => {
        artist.isFavourite = this.favourites.some(fav => fav.artistId === artist.id);
      });
      this.cdRef.detectChanges();
    });
  }

  fetchArtistDetails(artistId: string) {
    this.http.get<any>(`http://localhost:3000/artist-details?artistID=${artistId}`).subscribe(
      (response) => {
        this.artistDetail = response; // Assuming the service returns artist details
        this.isLoading = false;
      },
      (error) => {
        console.error("Error fetching artist details:", error);
        this.isLoading = false;
      }
    );
  }

  onSearch() {
    console.log("Searching for:", this.searchText);
  }

  loadFavourites() {
    this.favourites = JSON.parse(this.cookieService.get("fav") || '[]');
  }

  onArtistSearch() {
    this.isLoading = true;
    this.noArtistsFound = false;
    this.selectedArtistID = null;
    this.options = ''; // ------------------CHECK THIS OUT----------------
    this.artistDetail = {};
    this.http.get<any[]>(`${this.apiArtistSearch}?artistName=${this.artistName}`).subscribe(
      (response) => {
        console.log("Artists received:", response);
        this.artists = response;
        this.isLoading = false;

        this.artists.forEach(artist => {
          artist.isFavourite = this.favourites.some(fav => fav.artistId === artist.id);
        });
        
        if (this.artists.length === 0) {
          this.noArtistsFound = true;
        }
        console.log("favs:", this.favourites, "\nto check fav", this.artists);
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error("Error fetching artists:", error);
        this.isLoading = false;
      }
    );
  } 

  defaultImage = "artsy_logo.svg";

  setDefaultImage(event: any) {
    event.target.src = this.defaultImage;
  }

  artistInfo(artistId: string) {
    this.selectedArtistID = artistId;
    this.options = 'artistDetails';
    console.log("artist id:", this.selectedArtistID);
    this.artistService.setArtistId(artistId);
  }

  onClickFav(artist: any) {
    artist.isFavourite = !artist.isFavourite;
    this.updateFavouriteStatus(artist);
  }

  updateFavouriteStatus(artist: any) {
    let flag = artist.isFavourite ? 1 : 0;
    if(flag == 1){
      this.notificationService.showNotification('Added to favorites', 'success');
    }else{
      this.notificationService.showNotification('Removed from favorites', 'danger');
    }
    const requestBody = {
      emailID: this.username,
      artistID: artist.id,
      flag: flag
    };

    console.log(requestBody);
    const token = this.cookieService.get('jwtoken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.post('http://localhost:3000/fav', requestBody, {headers})
      .subscribe(response => {
        console.log(response);
        let currentFavourites = [...this.favourites];

        if(artist.isFavourite){
          const existingArtistIndex = currentFavourites.findIndex(fav => fav.artistId === artist.id);
          if (existingArtistIndex === -1) {
            currentFavourites.push({
              artistId: artist.id,
              addedAt: new Date().toISOString()
            });
          }
        } else {
          currentFavourites = currentFavourites.filter(fav => fav.artistId !== artist.id);
        }

        this.favouritesService.updateFavourites(currentFavourites);
        this.cookieService.set('fav', JSON.stringify(currentFavourites));
        this.favourites = currentFavourites;  // Update the local list
        console.log("Updated cookie:", this.cookieService.get("fav"));
      }, error => {
        console.error('Error updating favourite status:', error);
      });
  }

  changeTab(currentTab: string) {
    this.options = currentTab;
    this.artistService.setArtistId(this.selectedArtistID as string);
  }

  onClear() {
    this.artists = [];
    this.searchText = '';
    this.selectedArtistID = null; // Reset selected artist ID
    this.options = ''; // Clear the options bar
    this.artistDetail = {}; // Reset artist details
    this.noArtistsFound = false; // Hide "no artists found" message
    this.cdRef.detectChanges();
    this.cdRef.detectChanges();
    window.location.reload();
  }
}
