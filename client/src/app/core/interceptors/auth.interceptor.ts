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
      if (error.status === 401) {
        const message = error.error?.message || 'Something went wrong.';
        notification.error(message);
        router.navigate(['/auth/login'], { queryParams: { sessionFailed: true } });
      }
      else {
        const message = error.error?.message || 'Unexpected server error. Try again later.';
        notification.error(message);
      }
      return throwError(() => error);
    })
  );
};
