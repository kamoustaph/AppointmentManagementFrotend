import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Token } from '../services/token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const router = inject(Router);

  const token = tokenService.getToken();
  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        tokenService.clearToken();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.routerState.snapshot.url }
        });
      }
      return throwError(() => error);
    })
  );
};