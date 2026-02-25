import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService)

  if (auth.isAuthenticated()) {
    req = req.clone({
      setHeaders: {
        Authorization: auth.getToken()
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
        const message = error.error?.message || 'Unexpected server error';
        notification.error(message);
      }
      return throwError(() => error);
    })
  );
};
