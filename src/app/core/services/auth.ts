import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserCredentials, UserRegistration } from '../models/user.model';
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
        this.tokenService.setToken(response.token);
        this.setCurrentUser(response.user);
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: ERole): boolean {
    const user = this.currentUserSubject.value;
    return !!user?.roles?.has({ name: role } as Role);
  }

  private setCurrentUser(userData: any): void {
    const user: User = {
      id: userData.id,
      username: userData.username,
      name: userData.name,
      phone: userData.phone,
      roles: new Set(userData.roles || []),
      role: userData.role || { name: ERole.SECRETAIRE },
      actif: userData.actif || false,
      deviceToken: userData.deviceToken
    };
    this.currentUserSubject.next(user);
  }
}
