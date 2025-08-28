import { Routes } from '@angular/router';
import { Dashboard } from './admin/dashboard/dashboard';
import { Login } from './auth/login/login';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    {
       path:'',
       redirectTo: 'auth/login',
       pathMatch: 'full'
    },
    {
        path:'auth/login',
        component: Login
    },
    {
        path: 'admin/dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    }
];
