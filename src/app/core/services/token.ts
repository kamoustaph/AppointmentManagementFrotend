import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Token {
  private readonly TOKEN_KEY = 'auth_token';
  private tokenExpiredSubject = new BehaviorSubject<boolean>(true);
  public tokenExpired$ = this.tokenExpiredSubject.asObservable();

  setToken(token: string): void {
    if (!token) throw new Error('Token cannot be empty');
    localStorage.setItem(this.TOKEN_KEY, token);
    this.checkTokenExpiration();
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ? token : null;
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenExpiredSubject.next(true);
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;

    return Date.now() >= decoded.exp * 1000;
  }

  private checkTokenExpiration(): void {
    this.tokenExpiredSubject.next(this.isTokenExpired());
  }

  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return null;

    return new Date(decoded.exp * 1000);
  }

  getDecodedToken(): any {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }
}