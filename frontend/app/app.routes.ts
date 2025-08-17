import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { ArtistSearchComponent } from './components/artist-search/artist-search.component';
import { FavouritesComponent } from './components/favourites/favourites.component';

export const routes: Routes = [
    {
        path:'',
        component:ArtistSearchComponent
    },
    {
        path:'login',
        component:UserLoginComponent
    },
    {
        path:'register',
        component:UserRegisterComponent
    },
    {   path: 'artist-search/:artistId', 
        component: ArtistSearchComponent
    },
    {
        path: 'favourites',
        component: FavouritesComponent
    }
];