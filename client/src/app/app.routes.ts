import { Routes } from '@angular/router';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { NotFound } from './features/not-found/not-found';
import { OAuthSuccessPage } from './features/oAuthSuccess/o-auth-success-page/o-auth-success-page';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './features/auth/models/role.enum';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AuthRoutes)
      }
    ]
  },
  { path: 'oauth-success', component: OAuthSuccessPage },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DashboardRoutes)
      },
      {
        path: 'search',
        loadChildren: () => import('./features/search/search.routes').then((m) => m.SearchRoutes)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes').then((m) => m.InventoryRoutes)
      },
      {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN] },
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.AdminRoutes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', component: NotFound },
];
