import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'];
  const role = authService.getRole();

  if (role && requiredRoles.includes(role)) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
