import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ArtistDetailService } from '../artist-detail.service';


@Component({
  selector: 'app-artist-works',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './artist-works.component.html',
  styleUrl: './artist-works.component.css'
})
export class ArtistWorksComponent {
  artistId: string | null = null;
  aptArtistID:string = "http://localhost:3000/artworks";
  artworkDetail: any[] = [];
  artworkID: string = "";
  aptArtCategory:string = "http://localhost:3000/categories";
  artworkCategories: any[] = [];
  isLoading: boolean = false;
  noArtistworksFound: boolean = false;
  noCategoryFound: boolean = false;

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private artistService : ArtistDetailService) { }

  ngOnInit() {
    this.artistService.artistId$.subscribe((id) => {
      console.log("Heheheh Received Artist ID in Info Component:", id);
      this.artistId = id;
      if (this.artistId) {
        this.artworkDisplay();
      }
    });
  }
  defaultImage = "artsy_logo.svg";

  setDefaultImage(event: any){
    event.target.src = this.defaultImage;
  }
  artworkDisplay() {
    this.isLoading=true;
    this.noArtistworksFound = false;
    console.log("Fetching artworks for artist ID:", this.artistId);
    this.artworkDetail = []; 
    this.http.get<any>(`${this.aptArtistID}?artist_id=${this.artistId}&size=10`).subscribe(
      (response) => {
        console.log("Artworks received:", response);
        this.artworkDetail = response;
        this.isLoading=false;

        if (this.artworkDetail.length === 0) {
          this.noArtistworksFound = true;
        }
      },
      (error) => {
        console.error("Error fetching artworks:", error);
      }
    );
  }
  
  onClickArtwork(artworkId: string){
    this.isLoading=true;
    this.noCategoryFound = false;
    this.artworkID = artworkId;
    console.log("Artwork id received:", this.artworkID);
    this.http.get<any>(`${this.aptArtCategory}?artwork_id=${this.artworkID}`).subscribe(
      (response) => {
        console.log("Genes received!", response);
        this.artworkCategories = response;
        this.isLoading=false;
        if (this.artworkDetail.length === 0) {
          this.noCategoryFound = true;
        }
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error("Erroe fetching categories", error);
      }
    );
  }

  
}
