import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ERole } from '../../../core/models/role.model';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class roleguardGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (!this.auth.isAuthenticated) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    const requiredRoles: ERole[] = route.data['roles'] || [];
    if (requiredRoles.length === 0) {
      return true;
    }

    return this.auth.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url }
          });
        }

        // Normalisation des rôles utilisateur pour retirer le préfixe "ROLE_" si présent
        const userRolesNormalized = Array.from(user.roles).map(r =>
          r.name.startsWith('ROLE_') ? r.name.substring(5) : r.name
        );

        const hasRole = requiredRoles.some(expectedRole =>
          userRolesNormalized.includes(expectedRole)
        );

        if (hasRole) {
          return true;
        } else {
          return this.router.createUrlTree(['/unauthorized'], {
            queryParams: { returnUrl: state.url }
          });
        }
      })
    );
  }
}
