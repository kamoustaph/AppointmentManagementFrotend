import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Token {
  private readonly TOKEN_KEY = 'auth_token';

  setToken(token: string): void {
    if (!token) throw new Error('Token cannot be empty');
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp ? decoded.exp * 1000 < Date.now() : true;
    } catch {
      return true;
    }
  }

  isTokenValid(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }
}