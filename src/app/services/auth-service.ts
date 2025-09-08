import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  isAuthenticated() {
    if (localStorage.getItem('token')) return true;
    else this.router.navigate(['/login']);
    return false;
  }
  private tokenKey = 'token';
  private refreshTokenKey = 'refresh_token';
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  token = signal<string | null>(localStorage.getItem('token'));
  setToken(token: string | null) {
    this.token.set(token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.tokenSubject.next(null);
  }
}
