import { Routes } from '@angular/router';
import {
  AuthErrorPage,
  ForbiddenPage,
  NotFoundPage,
  ServerErrorPage,
} from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';
import { ByuLayout } from './layouts/byu/byu.layout';
import { TasksPage } from './pages/tasks/tasks.page';
import { permissionGuard } from './utils/permission.guard';
import { StatsPage } from './pages/stats/stats.page';

export const routes: Routes = [
  { path: 'server-error', component: ServerErrorPage },
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'auth-error', component: AuthErrorPage },
  { path: '', 
    component: ByuLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'tasks', component: TasksPage, canActivate: [permissionGuard(['manage-tasks'])] },
      { path: 'stats', component: StatsPage, canActivate: [permissionGuard(['manage-tasks'])] }
    ],
  },
  { path: '**', component: NotFoundPage },
];
