// favourites.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private favouritesSubject = new BehaviorSubject<{ artistId: string, addedAt: string }[]>([]);
  favourites$ = this.favouritesSubject.asObservable();

  constructor(private cookieService: CookieService) {
    const storedFavs = this.cookieService.get('fav');
    if (storedFavs) {
      this.favouritesSubject.next(JSON.parse(storedFavs));
    }
  }

  updateFavourites(newFavs: { artistId: string, addedAt: string }[]) {
    this.favouritesSubject.next(newFavs);
    this.cookieService.set('fav', JSON.stringify(newFavs), { expires: 7 });
  }

  getFavourites() {
    return this.favouritesSubject.getValue();
  }

  clearFavourites() {
    this.cookieService.delete('fav');
    this.favouritesSubject.next([]);
  }
}
