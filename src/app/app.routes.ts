
import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Activation } from './features/auth/activation/activation'; 

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
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'register'
  }
];
