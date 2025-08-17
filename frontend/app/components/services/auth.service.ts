import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private fullnameSubject = new BehaviorSubject<string>('');
  private usernameSubject = new BehaviorSubject<string>('');
  private jwtokenSubject = new BehaviorSubject<string>('');
  private gravadarSubject = new BehaviorSubject<string>('');
  private favouritesSubject = new BehaviorSubject<string[]>([]);
  
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  fullname$ = this.fullnameSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  jwtoken$ = this.jwtokenSubject.asObservable();
  gravadar$ = this.gravadarSubject.asObservable();
  favourites$ = this.favouritesSubject.asObservable();


  constructor() {
    // Check if user is already logged in on app load
    const storedToken = localStorage.getItem('jwtoken');
    const storedFullname = localStorage.getItem('fullname');
    const storedGravadar = localStorage.getItem('gravadar');
    const storedUsername = localStorage.getItem('username');
    if (storedFullname) {
      this.isLoggedInSubject.next(true);
      this.fullnameSubject.next(storedFullname);
    }
    if (storedGravadar) {
      this.gravadarSubject.next(storedGravadar);
    }
    if (storedUsername) {
      this.usernameSubject.next(storedUsername);
    }
  }

  login(fullname: string, username: string, jwtoken: string, gravadar:string) {
    console.log("Fullnameee: ", fullname, "usernamee", username, "jwtoken:", jwtoken, "gravadar", gravadar)
    localStorage.setItem('fullname', fullname);
    localStorage.setItem('username', username);
    localStorage.setItem('jwtoken', jwtoken);
    localStorage.setItem('gravadar', gravadar);
    this.isLoggedInSubject.next(true);
    this.fullnameSubject.next(fullname);
    this.usernameSubject.next(username);
    this.jwtokenSubject.next(jwtoken);
    this.gravadarSubject.next(gravadar);
  }

  logout() {
    localStorage.removeItem('fullname');
    this.isLoggedInSubject.next(false);
    this.fullnameSubject.next('');
  }
}




/*import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FavouritesService } from '../services/favourites.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private fullnameSubject = new BehaviorSubject<string>('');
  private usernameSubject = new BehaviorSubject<string>('');
  private jwtokenSubject = new BehaviorSubject<string>('');
  private gravadarSubject = new BehaviorSubject<string>('');
  
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  fullname$ = this.fullnameSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  jwtoken$ = this.jwtokenSubject.asObservable();
  gravadar$ = this.gravadarSubject.asObservable();

  constructor(private cookieService: CookieService,
    private router: Router, private favouritesService: FavouritesService) {
    const storedToken = localStorage.getItem('jwtoken');
    if (storedToken) {
      this.checkLoginStatus();
    }
  }

  login(fullname: string, username: string, jwtoken: string, gravadar: string) {
    localStorage.setItem('fullname', fullname);
    localStorage.setItem('username', username);
    localStorage.setItem('jwtoken', jwtoken);
    localStorage.setItem('gravadar', gravadar);

    this.checkLoginStatus(); 
    this.isLoggedInSubject.next(true);
    this.jwtokenSubject.next(jwtoken);
    this.fullnameSubject.next(fullname);
    this.usernameSubject.next(username);
    this.gravadarSubject.next(gravadar);
  }

  private checkLoginStatus() {
    const loginTime = localStorage.getItem('loginTime');
    const storedToken = localStorage.getItem('jwtoken');

    if (loginTime && storedToken) {
      const timeElapsed = new Date().getTime() - parseInt(loginTime);
      const oneHourInMilliseconds = 60 * 60 * 1000; // 1 hour in milliseconds

      if (timeElapsed > oneHourInMilliseconds) {
        this.logout();
      } else {
        this.setUserDataFromLocalStorage();
      }
    } else {
      this.logout();
    }
  }

  private setUserDataFromLocalStorage() {
    const storedFullname = localStorage.getItem('fullname');
    const storedUsername = localStorage.getItem('username');
    const storedGravadar = localStorage.getItem('gravadar');
    
    if (storedFullname) {
      this.fullnameSubject.next(storedFullname);
    }
    if (storedUsername) {
      this.usernameSubject.next(storedUsername);
    }
    if (storedGravadar) {
      this.gravadarSubject.next(storedGravadar);
    }
  }

  logout() {
    localStorage.removeItem('fullname');
    localStorage.removeItem('username');
    localStorage.removeItem('jwtoken');
    localStorage.removeItem('gravadar');
    
    this.isLoggedInSubject.next(false);
    this.jwtokenSubject.next('');
    this.fullnameSubject.next('');
    this.usernameSubject.next('');
    this.gravadarSubject.next('');
    localStorage.removeItem('fullname');
    this.isLoggedInSubject.next(false);
    this.fullnameSubject.next('');
    this.router.navigate(['/']);
    this.favouritesService.clearFavourites();
    this.cookieService.deleteAll();
  }
}


import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private fullnameSubject = new BehaviorSubject<string>('');
  private usernameSubject = new BehaviorSubject<string>('');
  private jwtokenSubject = new BehaviorSubject<string>('');
  private gravadarSubject = new BehaviorSubject<string>('');
  private favouritesSubject = new BehaviorSubject<string[]>([]);
  
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  fullname$ = this.fullnameSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  jwtoken$ = this.jwtokenSubject.asObservable();
  gravadar$ = this.gravadarSubject.asObservable();
  favourites$ = this.favouritesSubject.asObservable();


  constructor() {
    // Check if user is already logged in on app load
    const storedToken = localStorage.getItem('jwtoken');
    const storedFullname = localStorage.getItem('fullname');
    const storedGravadar = localStorage.getItem('gravadar');
    const storedUsername = localStorage.getItem('username');
    if (storedFullname) {
      this.isLoggedInSubject.next(true);
      this.fullnameSubject.next(storedFullname);
    }
    if (storedGravadar) {
      this.gravadarSubject.next(storedGravadar);
    }
    if (storedUsername) {
      this.usernameSubject.next(storedUsername);
    }
  }

  login(fullname: string, username: string, jwtoken: string, gravadar:string) {
    console.log("Fullnameee: ", fullname, "usernamee", username, "jwtoken:", jwtoken, "gravadar", gravadar)
    localStorage.setItem('fullname', fullname);
    localStorage.setItem('username', username);
    localStorage.setItem('jwtoken', jwtoken);
    localStorage.setItem('gravadar', gravadar);
    this.isLoggedInSubject.next(true);
    this.fullnameSubject.next(fullname);
    this.usernameSubject.next(username);
    this.jwtokenSubject.next(jwtoken);
    this.gravadarSubject.next(gravadar);
  }

  logout() {
    localStorage.removeItem('fullname');
    this.isLoggedInSubject.next(false);
    this.fullnameSubject.next('');
  }
}



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:3000';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Login function
  login(credentials: { emailID: string; password: string }) {
    return this.http.post(`${this.authUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(() => this.getUserProfile().subscribe()),  // Fetch user profile after login
      catchError((error) => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  // Get the current user's profile
  getUserProfile() {
    return this.http.get(`${this.authUrl}/me`, { withCredentials: true }).pipe(
      tap((user: any) => this.userSubject.next(user)),
      catchError(() => {
        this.userSubject.next(null);
        return of(null);
      })
    );
  }

  // Logout function
  logout() {
    // Clear the user and navigate to login
    this.userSubject.next(null);
  }

  // Check if the user is authenticated
  isAuthenticated() {
    return this.userSubject.value !== null;
  }
}
*/