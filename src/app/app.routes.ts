import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Activation } from './features/auth/activation/activation'; 
import { Login } from './features/auth/login/login';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { roleguardGuard } from './shared/components/guards/roleguard-guard';
import { ERole } from './core/models/role.model';
import { PatientList } from './shared/components/patient/patient-list/patient-list';
import { Layout } from './shared/components/layout/layout';
export const routes: Routes = [
  // Routes publiques
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'activation',
    component: Activation,
  },
  {
    path: 'register',
    component: Register,
  },

  // Redirection par défaut vers /login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '',
    component: Layout,
    canActivate: [roleguardGuard], // Vérifie l'authentification
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'patient',
        component: PatientList,
        canActivate: [roleguardGuard], // Vérifie aussi les rôles
        data: { roles: [ERole.MEDECIN] },
      },
    ],
  },

  // Wildcard (doit être en dernier)
  {
    path: '**',
    redirectTo: 'login',
  },
];