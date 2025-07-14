import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const token = auth.getToken();
  console.log('[AuthInterceptor] Token:', token);

  if (!token) {
    console.log('[AuthInterceptor] Pas de token, requête sans modification');
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log('[AuthInterceptor] Requête modifiée avec token');

  return next(authReq).pipe(
    tap(event => {
      // Optionnel : log event de réponse si besoin
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('[AuthInterceptor] Erreur HTTP détectée:', error);
      if (error.status === 401) {
        console.warn('[AuthInterceptor] 401 Unauthorized détecté, déconnexion');
        auth.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.routerState.snapshot.url }
        });
      }
      return throwError(() => error);
    })
  );
};
