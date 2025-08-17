import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient,  private cookieService: CookieService) {}

  checkAuthStatus() {
    this.http.get('http://localhost:3000/me', { withCredentials: true }).subscribe(
      (response: any) => {
        console.log('Authenticated user data:', response);
        this.userSubject.next(response.user);
      },
      () => {
        this.userSubject.next(null);
      }
    );
  }
  logout() {
    this.cookieService.deleteAll();
    this.userSubject.next(null);
  }
}
  