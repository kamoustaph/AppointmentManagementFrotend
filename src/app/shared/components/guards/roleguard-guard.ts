import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { ERole } from '../../../core/models/role.model';

export const roleguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Si l'utilisateur n'est pas authentifié, rediriger vers login
  if (!authService.isAuthenticated) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  const requiredRoles = route.data['roles'] as ERole[];

  // Si pas de rôles requis, on autorise l'accès
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Vérification des rôles
  return authService.currentUser$.pipe(
    take(1), // Prendre la première émission et compléter
    map(user => {
      if (!user) {
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      }

      const hasRequiredRole = requiredRoles.some(role => 
        user?.roles && Array.from(user.roles).some(r => r.name === role)
      );

      if (hasRequiredRole) {
        return true;
      }

      // Redirection si non autorisé
      return router.createUrlTree(['/unauthorized'], {
        queryParams: { returnUrl: state.url }
      });
    })
  );
};