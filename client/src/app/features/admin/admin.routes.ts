import { Routes } from '@angular/router';
import { AdminPage } from './pages/admin-page/admin-page';
import { UserProfile } from './components/user-profile/user-profile';

export const AdminRoutes: Routes = [
  { path: '', component:  AdminPage},
  { path: ':id/user', component:  UserProfile}
];