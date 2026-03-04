import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const notification = inject(NotificationService);
  
  const token = tokenService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = error.error?.message || 'Unexpected server error.';
      if (error.status === 401) {
        notification.error(errorMessage);
        router.navigate(['/auth/login'], { queryParams: { sessionFailed: true } });
      }
      else if (error.status === 400 || error.status === 409) {
        notification.error(errorMessage);
      }
      else {
        notification.error('Server error. Please try again later.');
      }
      return throwError(() => error);
    })
  );
};
