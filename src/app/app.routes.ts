import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { authGuard } from './auth/auth-guard/auth-guard';
import { roleCanActivate, roleCanMatch } from './auth/role-guard/role-guard';
import { Header } from './shared/header/header';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    component: Login,
  },
  {
    path: 'admin',
    component: Header,
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/users/pages/users-table-read/users-table-read')
        .then(m => m.UsersTableRead),
        canMatch: [roleCanMatch],
        canActivate: [roleCanActivate],
        data: { roles: ['USER', 'SUPERVISOR', 'ADMIN'] }
      },
      {
        path: 'users/manage',
        loadComponent: () =>
          import('./admin/users/pages/users-manage/users-manage')
        .then(m => m.UsersManage),
        canMatch: [roleCanMatch],
        canActivate: [roleCanActivate],
        data: { roles: ['SUPERVISOR', 'ADMIN'] }        
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./admin/users/pages/users-create/users-create')
        .then(m => m.UsersCreate),
        canMatch: [roleCanMatch],
        canActivate: [roleCanActivate],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'users/barcode',
        loadComponent: () =>
          import('./admin/users/pages/barcode-generator/barcode-generator')
        .then(m => m.BarcodeGenerator)
      },
      { path: '', pathMatch: 'full', redirectTo: 'users' }
    ]
  },
];
