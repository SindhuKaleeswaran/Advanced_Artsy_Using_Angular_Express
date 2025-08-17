import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistDetailService {

  constructor() { }

  private artistIdSubject = new BehaviorSubject<string | null>(null);
  artistId$ = this.artistIdSubject.asObservable();
  
  //setArtistId(artistId: string) {
    //this.artistIdSource.next(artistId);
    //#this.artistIdSource.next(options);
  //}
  setArtistId(artistId: string) {
    this.artistIdSubject.next(artistId);
  }
}
