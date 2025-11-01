import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'buildings',
        loadComponent: () => import('./features/buildings/buildings.component').then((m) => m.BuildingsComponent)
      },
      {
        path: 'facilities',
        loadComponent: () => import('./features/facilities/facilities.component').then((m) => m.FacilitiesComponent)
      },
      {
        path: 'therapists',
        loadComponent: () => import('./features/therapists/therapists.component').then((m) => m.TherapistsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/reservations/reservations.component').then((m) => m.ReservationsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
