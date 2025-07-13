
import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Activation } from './features/auth/activation/activation'; 
import { Login } from './features/auth/login/login';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { Layout } from './shared/components/layout/layout';

export const routes: Routes = [
  
   {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      // { path: 'patient', loadChildren: () => import('./features/patient/patient.routes') },
      // { path: 'medecin', loadChildren: () => import('./features/medecin/medecin.routes') },
      // // Ajoutez ici toutes les routes qui doivent avoir la sidebar
    ]
  },


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
