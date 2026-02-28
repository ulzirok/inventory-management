import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { DashboardList } from './components/dashboard-list/dashboard-list';

export const DashboardRoutes: Routes = [
    { path: '', component: DashboardPage },
    { path: 'list', component: DashboardList }
];