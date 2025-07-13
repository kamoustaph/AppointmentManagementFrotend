import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Activation } from './features/auth/activation/activation'; 
import { Login } from './features/auth/login/login';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { Layout } from './shared/components/layout/layout';
import { roleguardGuard } from './shared/components/guards/roleguard-guard';
import { ERole } from './core/models/role.model';

export const routes: Routes = [
 {
    path: '',
    component: Layout,
    canActivate: [roleguardGuard], 
    children: [
      { 
        path: 'dashboard', 
        component: Dashboard
      },
      // ... autres routes enfants
    ]},
  {
    path: 'login',
    component: Login
  },
  {
    path: 'activation',
    component: Activation
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];