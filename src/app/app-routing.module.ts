import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { AdminLayoutComponent } from './layout/admin-layout.component';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/auth/register/role-selection.component').then((m) => m.RoleSelectionComponent)
      },
      {
        path: ':role',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
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
  {
    path: 'therapist',
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['TERAPEUTA'] },
    loadComponent: () =>
      import('./features/therapist/therapist-dashboard.component').then((m) => m.TherapistDashboardComponent)
  },
  {
    path: 'patient',
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['PACIENTE'] },
    loadComponent: () =>
      import('./features/patient/patient-dashboard.component').then((m) => m.PatientDashboardComponent)
  },
  {
    path: 'user',
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['USUARIO', 'ADMIN'] },
    loadComponent: () => import('./features/user/user-dashboard.component').then((m) => m.UserDashboardComponent)
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./features/errors/forbidden.component').then((m) => m.ForbiddenComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export { routes };
