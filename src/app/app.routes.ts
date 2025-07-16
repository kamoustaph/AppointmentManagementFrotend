import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Activation } from './features/auth/activation/activation'; 
import { Login } from './features/auth/login/login';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { roleguardGuard } from './shared/components/guards/roleguard-guard';
import { ERole } from './core/models/role.model';
import { PatientList } from './shared/components/patient/patient-list/patient-list';
import { Layout } from './shared/components/layout/layout';
import { DoctorList } from './shared/components/doctor/doctor-list/doctor-list';
import { SpecialtyList } from './shared/components/specialty/specialty-list/specialty-list';
import { TimeSlotList } from './shared/components/timeSlot/time-slot-list/time-slot-list';
export const routes: Routes = [
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

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '',
    component: Layout,
    canActivate: [roleguardGuard], 
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'patient',
        component: PatientList,
        canActivate: [roleguardGuard], 
        data: { roles: [ERole.MEDECIN,ERole.PATIENT] },
      },
      {
        path: 'doctor',
        component: DoctorList,
        canActivate: [roleguardGuard], 
        data: { roles: [ERole.MEDECIN,ERole.PATIENT] },
      },
      {
        path: 'specialty',
        component: SpecialtyList,
        canActivate: [roleguardGuard], 
        data: { roles: [ERole.MEDECIN,ERole.PATIENT] },
      },
      {
        path: 'timeSlot',
        component: TimeSlotList,
        canActivate: [roleguardGuard], 
        data: { roles: [ERole.MEDECIN,ERole.PATIENT] },
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];