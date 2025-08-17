import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, FormBuilder,FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FavouritesService } from '../services/favourites.service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-user-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule,RouterLink,RouterOutlet],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  userForm: FormGroup = new FormGroup({
      emailID: new FormControl("",[Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{3}')]),
      password: new FormControl("",[Validators.required])
  })

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef,
     private authService: AuthService,  private router: Router, 
     private favouritesService: FavouritesService, private cookieService: CookieService, private notificationService: NotificationsService) { }
  
  onUserLogin(){
    const formValue =this.userForm.value;
    console.log('Sending data:', formValue);
    
    this.http.post('http://localhost:3000/login', formValue, { withCredentials: true }).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        //alert(response.message);
        this.authService.login(response.fullname,response.username,response.jwtoken, response.prfpic);
        this.router.navigate(['/']);
        const favourite = this.cookieService.get('fav');
        if (favourite) {
          const parsedFavs = JSON.parse(favourite);
          this.favouritesService.updateFavourites(parsedFavs);
        }
        this.cookieService.set("fav", favourite);
        console.log("chk fav", favourite);
        this.notificationService.showNotification('Logged in');
      },
      (error) => {
        if (error.status === 400) {
          // Backend returned a 400 status
          this.userForm.controls['password'].setErrors({ invalidCredential: true });
        }
      }
    );
    
  }

}























/*onUserLogin() {
    const formValue = this.userForm.value;
    
    if (formValue.emailID && formValue.password) {
      this.authService.login(formValue).subscribe(
        () => {
          alert('Login successfullll');
          this.router.navigate(['/']);  // Redirect to dashboard after login
        },
        (error) => {
          console.error('Login error:', error);
          alert('Invalid credentials');
        }
      );
    }
  } */