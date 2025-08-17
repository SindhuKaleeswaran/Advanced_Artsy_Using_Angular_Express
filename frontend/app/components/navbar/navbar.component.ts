import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationEnd } from '@angular/router';
import { FavouritesService } from '../services/favourites.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationsService } from '../services/notifications.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet, RouterLink, CommonModule, NotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  fullname: string = '';
  icon: string = '';
  username: string = '';
  activeLink: string = 'search';

  constructor(private authService: AuthService, private http: HttpClient, private cookieService: CookieService,
    private router: Router, private favouritesService: FavouritesService, private notificationService: NotificationsService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.setActive('search'); 

    this.authService.fullname$.subscribe((name) => {
      this.fullname = name;
    });
    
    this.authService.gravadar$.subscribe((icon) => {
      this.icon = icon;
    });

    this.authService.username$.subscribe((name) => {
      this.username = name;
    });

    console.log("some icon ig",this.icon);

  }

  login() {
    this.setActive('search');
    this.notificationService.showNotification('Logged in successfully!'); 
    alert("lodded in");
  }

  setActive(link: string): void {
    this.activeLink = link;
  }

  logout() {
    this.router.navigate(['/']);
    this.authService.logout();
    this.favouritesService.clearFavourites();
    this.cookieService.deleteAll();
    this.setActive('search');
    window.location.reload();
    this.router.navigate(['/']);
    window.sessionStorage.setItem('notification', 'Logged out');

    setTimeout(() => {
      window.sessionStorage.removeItem('notification');
    }, 1500);
  } 

  deleteUser(){
    const token = this.cookieService.get('jwtoken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const emailID = this.username;
    this.http.delete('http://localhost:3000/user',{ headers, body: { emailID }})
      .subscribe(response => {
        console.log('User deleted successfully:', response);
        this.authService.logout();
        this.cookieService.deleteAll();
        this.favouritesService.clearFavourites();
        this.router.navigate(['#']);
        window.location.reload();
        window.sessionStorage.setItem('notification', 'Account Deleted');

        setTimeout(() => {
          window.sessionStorage.removeItem('notification');
        }, 1500);
      }, error => {
        console.error('Error deleting user:', error);
      });
  }
}
