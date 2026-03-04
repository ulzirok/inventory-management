import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { DashboardList } from './components/dashboard-list/dashboard-list';
import { DashboardItems } from './components/dashboard-items/dashboard-items';

export const DashboardRoutes: Routes = [
    { path: '', component: DashboardPage },
    { path: 'list', component: DashboardList },
    { path: ':id/items', component: DashboardItems }
];