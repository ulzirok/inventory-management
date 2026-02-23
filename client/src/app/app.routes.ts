import { Routes } from '@angular/router';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { NotFound } from './features/not-found/not-found';

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
    {
        path: '',
        component: MainLayout,
        // canActivate: [authGuard],
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
                path: 'search',
                loadChildren: () => import('./features/search/search.routes').then((m) => m.SearchRoutes)
            },
        ]
    },
    { path: '**', component: NotFound },
];
