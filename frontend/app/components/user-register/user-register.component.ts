import { CommonModule } from '@angular/common';
import { Component, ElementRef,ViewChild } from '@angular/core';
import { FormsModule, FormBuilder,FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FavouritesService } from '../services/favourites.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink, RouterOutlet],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {
  userForm: FormGroup = new FormGroup({
    fullName: new FormControl("",[Validators.required, Validators.pattern('[a-zA-Z0-9_ ]*')]),
    emailID: new FormControl("",[Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{3}')]),
    password: new FormControl("",[Validators.required])
  })

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef,
    private authService: AuthService,  private router: Router, 
    private favouritesService: FavouritesService, private cookieService: CookieService
  ) { }

  onUserRegister() {
    const formValue = this.userForm.value;
    console.log('Sending data:', formValue);
  
    this.http.post('http://localhost:3000/register', formValue).subscribe(
      (response:any) => {
        alert(response.message);

        const loginData = {
        emailID : formValue.emailID,
        password : formValue.password};
  
        this.http.post('http://localhost:3000/login', loginData, {withCredentials: true}).subscribe(
          (loginResponse: any) => {
            console.log('Login successful:', loginResponse);
            alert(loginResponse.message);
  
            this.authService.login(loginResponse.fullname, loginResponse.username, loginResponse.jwtoken, loginResponse.prfpic);
            
            this.router.navigate(['/']);
  
            const favourite = this.cookieService.get('fav');
            if(favourite){
              const parsedFavs = JSON.parse(favourite);
              this.favouritesService.updateFavourites(parsedFavs);
            }
            this.cookieService.set('fav', favourite);
            console.log("chk fav", favourite);
          },
          (loginError) => {
            if (loginError.status === 400) {
              this.userForm.controls['password'].setErrors({ invalidCredential: true });
            }
          }
        );
      },
      (error) => {
        if(error.status === 400){
          this.userForm.controls['emailID'].setErrors({ userExists: true });
        }
      }
    );
  }
  
}






















  /*fullName: string  = '';
  email:string = '';
  Password:string ='';  
  emailValid: boolean = true;
  emailNotValid: boolean = false;
  emailStatus:String = '';

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) { }

  checkEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailPattern.test(this.email)) {
      this.emailValid = true;
      this.emailNotValid = false;
    } else {
      this.emailValid = false;
      this.emailNotValid = true;
    }
  }

  OnSubmit () {
    const userData = {
      Fullname: this.fullName,
      Username: this.email,
      Password: this.Password
    };

    this.http.post('http://localhost:3000/register', userData).subscribe(
      (response: any) => {
        if (response.message === "User with this already exist") {
          this.emailStatus = "User with this already exist";
        }
        console.log(this.emailStatus);
        alert(response.message);
        
        this.cdRef.detectChanges();
      },
      (error) => {
        alert('Registration failed!');
        console.error(error);
      }
    );
  }
}*/
