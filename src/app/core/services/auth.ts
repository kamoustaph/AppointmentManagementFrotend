import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserCredentials } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';
import { ERole, Role } from '../models/role.model';
import { RegistrationData } from '../../features/auth/register/register';
import { Token } from './token';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(Token);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:8092/api/utilisateurs';
  private rolesUrl = 'http://localhost:8092/api/roles';

  constructor() {
    console.log('[Auth] Initializing Auth Service');
    this.initializeUserFromStorage();
  }

  private initializeUserFromStorage(): void {
    const token = this.tokenService.getToken();
    
    if (token && !this.tokenService.isTokenExpired()) {
      try {
        const decodedToken = this.tokenService.decodeToken();
        if (decodedToken) {
          const userData = {
            id: decodedToken.sub,
            username: decodedToken.sub,
            name: decodedToken.nom || '',
            roles: decodedToken.roles || [],
            actif: true
          };
          this.setCurrentUser(userData);
        }
      } catch (e) {
        console.error('[Auth] Error initializing user from token:', e);
        this.clearAuthData();
      }
    } else {
      console.log('[Auth] No valid user session found');
      this.clearAuthData();
    }
  }

  activateAccount(activationCode: string): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(
    `${this.apiUrl}/activation`,
    { code: activationCode }
  );
}

  getRoles(): Observable<Role[]> {
  return this.http.get<Role[]>(this.rolesUrl);
}
  get isAuthenticated(): boolean {
    return this.tokenService.isTokenValid();
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  register(user: RegistrationData): Observable<{ message: string }> {
    const registrationData = {
      ...user,
      roles: [user.roleName],
      actif: false
    };
    return this.http.post<{ message: string }>(`${this.apiUrl}/inscription`, registrationData);
  }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/connexion`, credentials).pipe(
      tap(response => {
        console.log('[Auth] Login response:', response);
        const token = response.token;
        this.tokenService.setToken(token);

        const decodedToken = this.tokenService.decodeToken();
        if (decodedToken) {
          const userData = {
            id: decodedToken.sub,
            username: decodedToken.sub,
            name: decodedToken.nom || '',
            roles: decodedToken.roles || [],
            actif: true
          };
          this.setCurrentUser(userData);
        }
        
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(requiredRole: ERole): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) return false;

    return user.roles.some(role => {
      const roleName = role.startsWith('ROLE_') ? role.substring(5) : role;
      return roleName === requiredRole;
    });
  }

  private setCurrentUser(userData: {
    id: any;
    username: string;
    name: string;
    roles: string[];
    actif?: boolean;
  }): void {
    const user: User = {
      id: userData.id,
      username: userData.username,
      name: userData.name,
      roles: userData.roles,
      actif: userData.actif ?? true
    };

    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }
}