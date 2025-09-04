import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { AuthService } from './sevrice/auth-service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => {
      const m = await import('./pages/home/home');
      return m.Home;
    },
  },
  {
    path: 'teachers',
    canActivate: [authGuard],
    loadComponent: async () => {
      const m = await import('./pages/teachers/teachers');
      return m.Teachers;
    },
    children: [
      {
        path: 'new',
        loadComponent: async () => {
          const m = await import('./components/form/form');
          return m.Form;
        },
      },
      {
        path: ':id',
        loadComponent: async () => {
          const m = await import('./components/form/form');
          return m.Form;
        },
      },
    ],
  },
  {
    path: 'groups',
    canActivate: [authGuard],
    loadComponent: async () => {
      const m = await import('./pages/groups/groups');
      return m.Groups;
    },
  },
  {
    path: 'workloads',
    canActivate: [authGuard],
    loadComponent: async () => {
      const m = await import('./pages/workloads/workloads');
      return m.Workloads;
    },
  },
];
