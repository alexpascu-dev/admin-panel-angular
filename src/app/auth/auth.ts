import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../../models/LoginDto';
import { LoginResponseDto } from '../../models/LoginResponseDto';
import { CurrentUserPayload } from '../../models/CurrentUserPayload';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { apiUrl } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly API_URL = `${apiUrl}/auth/login`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private router = inject(Router);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  constructor() {
    if (this.isLoggedIn()) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(user: LoginDto): Observable<LoginResponseDto> {
    return this.http
      .post<LoginResponseDto>(this.API_URL, user)
      .pipe(tap((response) => this.doLoginUser(response)));
  }

  private doLoginUser(response: LoginResponseDto) {
    this.storeJwtToken(response.token);
    this.isAuthenticatedSubject.next(true);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
  }

  // Expose authentication state as observable
  getAuthenticationState(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded || !decoded.exp) return true;
      const expirationDate = decoded.exp * 1000;
      const now = new Date().getTime();
      return expirationDate < now;
    } catch (error) {
      console.warn('Token decoding failed:', error);
      return true;
    }
  }

  checkAndLogoutIfExpired() {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      localStorage.removeItem(this.JWT_TOKEN);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/']);
      this.snackBar.open('Session expired, please log in', 'Close', {
        duration: 1500,
      });
    }
  }

  getCurrentUser(): CurrentUserPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<CurrentUserPayload>(token);
    } catch {
      return null;
    }
  }

  getCurrentUsername(): string {
    return this.getCurrentUser()?.unique_name ?? 'Backup';
  }

  getCurrentUserEmail(): string {
    return this.getCurrentUser()?.email ?? 'backup@email.com';
  }

  getCurrentUserRole(): string {
    return this.getCurrentUser()?.role ?? 'undefined';
  }

  getRoles(): string[] {
    try {
      const decoded: any = jwtDecode(this.getToken() || '');
      return [].concat(decoded?.role || []);
    } catch {
      return [];
    }
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles();
    return roles.some((role) => userRoles.includes(role));
  }
}
