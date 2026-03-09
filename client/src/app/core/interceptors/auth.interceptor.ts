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
      switch (error.status) {
        case 401:
          notification.error(errorMessage || 'Account blocked or session expired ');
          router.navigate(['/auth/login'], { queryParams: { sessionFailed: true } });
          break;

        case 403:
          notification.error(errorMessage);
          router.navigate(['/auth/login'], { queryParams: { sessionFailed: true } });
          break;

        case 400:
        case 404:
        case 409:
        case 500:
          notification.error(errorMessage);
          break;

        default:
          notification.error('Server error. Please try again later.');
          break;
      }
      return throwError(() => error);
    })
  );
};
