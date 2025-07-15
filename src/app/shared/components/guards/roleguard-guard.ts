import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { ERole } from '../../../core/models/role.model';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { Auth } from '../../../core/services/auth';

@Injectable({
  providedIn: 'root',
})
export class roleguardGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    console.log(`[RoleGuard] Checking access to: ${state.url}`);

    return this.auth.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        console.log(user);
        
        if (!user && this.auth.isAuthenticated) {
          console.log(
            '[RoleGuard] User null but authenticated, reloading user'
          );
          // Remplacez reloadUserFromStorage par une nouvelle méthode si nécessaire
          return this.auth.currentUser$.pipe(take(1));
        }
        return of(user);
      }),
      map((user) => {
        if (!this.auth.isAuthenticated) {
          console.warn('[RoleGuard] User not authenticated');
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          });
        }

        const requiredRoles = route.data['roles'] as ERole[];
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        if (!user) {
          console.warn('[RoleGuard] No user data available');
          return this.router.createUrlTree(['/unauthorized']);
        }

        const hasRequiredRole = requiredRoles.some((role) =>
          this.auth.hasRole(role)
        );
        console.log(
          `[RoleGuard] Required roles: ${requiredRoles}, User has role: ${hasRequiredRole}`
        );

        return hasRequiredRole
          ? true
          : this.router.createUrlTree(['/unauthorized']);
      })
    );
  }
}