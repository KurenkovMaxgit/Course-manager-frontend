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
    path: 'login',
    loadComponent: async () => {
      const m = await import('./pages/login/login');
      return m.Login;
    },
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: async () => {
      const m = await import('./components/layout/layout');
      return m.Layout;
    },
    children: [
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
            canActivate: [authGuard],
            loadComponent: async () => {
              const m = await import('./components/inputs/teacher-inputs/teacher-inputs');
              return m.TeacherInputs;
            },
          },
          {
            path: ':id',
            canActivate: [authGuard],
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
            canActivate: [authGuard],
            loadComponent: async () => {
              const m = await import('./components/inputs/group-inputs/group-inputs');
              return m.GroupInputs;
            },
          },
          {
            path: ':id',
            canActivate: [authGuard],
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
            canActivate: [authGuard],
            loadComponent: async () => {
              const m = await import('./components/inputs/workload-inputs/workload-inputs');
              return m.WorkloadInputs;
            },
          },
          {
            path: ':id',
            canActivate: [authGuard],
            loadComponent: async () => {
              const m = await import('./components/inputs/workload-inputs/workload-inputs');
              return m.WorkloadInputs;
            },
          },
        ],
      },
      {
        path: 'subject',
        canActivate: [authGuard],
        loadComponent: async () => {
          const m = await import('./pages/subjects/subjects');
          return m.Subjects;
        },
        children: [
          {
            path: 'new',
            canActivate: [authGuard],
            loadComponent: async () => {
              const m = await import('./components/inputs/subject-inputs/subject-inputs');
              return m.SubjectInputs;
            },
          },
          {
            path: ':id',
            canActivate: [authGuard],
            loadComponent: async () => {
              const m = await import('./components/inputs/subject-inputs/subject-inputs');
              return m.SubjectInputs;
            },
          },
        ],
      },
    ],
  },
];
