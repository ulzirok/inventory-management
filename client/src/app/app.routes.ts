import { Routes } from '@angular/router';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { NotFound } from './features/not-found/not-found';
import { OAuthSuccessPage } from './features/oAuthSuccess/o-auth-success-page/o-auth-success-page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AuthRoutes)
      },
      {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
      }
    ]
  },
  { path: 'oauth-success', component: OAuthSuccessPage },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DashboardRoutes)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes').then((m) => m.InventoryRoutes)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.AdminRoutes)
      },
      {
        path: 'search',
        loadChildren: () => import('./features/search/search.routes').then((m) => m.SearchRoutes)
      },
    ]
  },
  { path: '**', component: NotFound },
];
