import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserCredentials } from '../models/user.model';
import { Token } from './token';
import { AuthResponse } from '../models/auth-response.model';
import { Role, ERole } from '../models/role.model';
import { RegistrationData } from '../../features/auth/register/register';

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
    // Restaurer user à partir de localStorage au démarrage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        this.setCurrentUser(userData);
      } catch (e) {
        console.error('Erreur lors de la restauration de l\'utilisateur', e);
        localStorage.removeItem('user');
      }
    }
  }

  get isAuthenticated(): boolean {
    return !!this.tokenService.getToken() && !this.tokenService.isTokenExpired();
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesUrl);
  }

  register(user: RegistrationData): Observable<{ message: string }> {
    const registrationData = {
      ...user,
      roles: new Set([user.roleName]),
      actif: false
    };
    return this.http.post<{ message: string }>(`${this.apiUrl}/inscription`, registrationData);
  }

  activateAccount(activationCode: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/activation`,
      { code: activationCode }
    );
  }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/connexion`, credentials).pipe(
      tap(response => {
        const token = this.extractTokenFromResponse(response);
        this.tokenService.setToken(token);

        if (response.user) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');  // Supprimer user stocké
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: ERole): boolean {
    const user = this.currentUserSubject.value;
    if (!user?.roles) return false;
    return Array.from(user.roles).some(r => {
      const normalized = r.name.startsWith('ROLE_') ? r.name.substring(5) : r.name;
      return normalized === role;
    });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {
      token: this.tokenService.getToken()
    }).pipe(
      tap(response => {
        const token = this.extractTokenFromResponse(response);
        this.tokenService.setToken(token);
      })
    );
  }

  private extractTokenFromResponse(response: AuthResponse): string {
    if (!response.token) {
      throw new Error('Token JWT manquant dans la réponse');
    }

    return typeof response.token === 'string'
      ? response.token
      : response.token.bearer;
  }

  private setCurrentUser(userData: {
    id: number;
    username: string;
    name: string;
    phone?: string;
    roles: string[];
    actif?: boolean;
    role?: string;
    deviceToken?: string;
  }): void {
    const rolesSet = new Set<Role>(
      userData.roles.map(roleName => ({
        id: this.getRoleId(roleName),
        name: roleName as ERole
      }))
    );

    const user: User = {
      id: userData.id,
      username: userData.username,
      name: userData.name,
      phone: userData.phone || '',
      roles: rolesSet,
      actif: userData.actif ?? false,
      role: {
        id: this.getRoleId(userData.role),
        name: (userData.role as ERole) || ERole.SECRETAIRE
      },
      deviceToken: userData.deviceToken
    };

    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(userData));  // Sauvegarde user dans localStorage
  }

  private getRoleId(roleName?: string): number {
    if (!roleName) return 0;
    const roleMap: Record<string, number> = {
      'SECRETAIRE': 1,
      'MEDECIN': 2,
      'PATIENT': 3,
      'ADMIN': 4
    };
    return roleMap[roleName] || 0;
  }
}
