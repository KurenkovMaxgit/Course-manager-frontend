import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { AuthService } from './services/auth-service';

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
    path: 'teacher',
    canActivate: [authGuard],
    loadComponent: async () => {
      const m = await import('./pages/teachers/teachers');
      return m.Teachers;
    },
    children: [
      {
        path: 'new',
        loadComponent: async () => {
          const m = await import('./components/inputs/teacher-inputs/teacher-inputs');
          return m.TeacherInputs;
        },
      },
      {
        path: ':id',
        loadComponent: async () => {
          const m = await import('./components/inputs/teacher-inputs/teacher-inputs');
          return m.TeacherInputs;
        },
      },
    ],
  },
  {
    path: 'group',
    canActivate: [authGuard],
    loadComponent: async () => {
      const m = await import('./pages/groups/groups');
      return m.Groups;
    },
    children: [
      {
        path: 'new',
        loadComponent: async () => {
          const m = await import('./components/inputs/group-inputs/group-inputs');
          return m.GroupInputs;
        },
      },
      {
        path: ':id',
        loadComponent: async () => {
          const m = await import('./components/inputs/group-inputs/group-inputs');
          return m.GroupInputs;
        },
      },
    ],
  },
  {
    path: 'workload',
    canActivate: [authGuard],
    loadComponent: async () => {
      const m = await import('./pages/workloads/workloads');
      return m.Workloads;
    },
    children: [
      {
        path: 'new',
        loadComponent: async () => {
          const m = await import('./components/inputs/workload-inputs/workload-inputs');
          return m.WorkloadInputs;
        },
      },
      {
        path: ':id',
        loadComponent: async () => {
          const m = await import('./components/inputs/workload-inputs/workload-inputs');
          return m.WorkloadInputs;
        },
      },
    ],
  },
];
