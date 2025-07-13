import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const roleguardGuard: CanActivateFn = (route, state) => {
const authService = inject(Auth);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as Array<string>;

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && requiredRoles.some(role => user.roles.includes(role))) {
        return true;
      }
            return router.createUrlTree(['/unauthorized'], {
        queryParams: { returnUrl: state.url }
      });
    })
  );};
