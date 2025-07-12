
import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Activation } from './features/auth/activation/activation'; 
import { Login } from './features/auth/login/login';
import { Dashboard } from './shared/components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'register',
    component: Register
  },
  {
    path: 'activation',
    component: Activation
  },
  {
    path: 'login',
    component: Login
  },
   {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'register'
  }
];
