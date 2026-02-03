import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, from, map, catchError, throwError } from 'rxjs';
import { ApiResponse, LoginRequest, RegisterRequest, User } from '../models/interfaces';
import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.1.200:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<{ token: string; user: User }>> {
    if (Capacitor.isNativePlatform()) {
      return from(Http.post({
        url: `${this.apiUrl}/auth/login`,
        headers: { 'Content-Type': 'application/json' },
        data: credentials
      })).pipe(
        map(result => result.data as ApiResponse<{ token: string; user: User }>),
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
        }),
        catchError((err) => {
          const normalized = {
            status: err?.status ?? 0,
            message: err?.message ?? 'Native HTTP error',
            error: err
          };
          return throwError(() => normalized);
        })
      );
    }

    return this.http.post<ApiResponse<{ token: string; user: User }>>(
      `${this.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<ApiResponse<any>> {
    if (Capacitor.isNativePlatform()) {
      return from(Http.post({
        url: `${this.apiUrl}/auth/register`,
        headers: { 'Content-Type': 'application/json' },
        data
      })).pipe(
        map(result => result.data as ApiResponse<any>),
        catchError((err) => {
          const normalized = {
            status: err?.status ?? 0,
            message: err?.message ?? 'Native HTTP error',
            error: err
          };
          return throwError(() => normalized);
        })
      );
    }

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/auth/register`,
      data
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  ping(): Observable<ApiResponse<any>> {
    if (Capacitor.isNativePlatform()) {
      return from(Http.get({
        url: this.apiUrl,
        params: {},
        headers: { 'Content-Type': 'application/json' }
      })).pipe(
        map(result => result.data as ApiResponse<any>),
        catchError((err) => {
          const normalized = {
            status: err?.status ?? 0,
            message: err?.message ?? 'Native HTTP error',
            error: err
          };
          return throwError(() => normalized);
        })
      );
    }

    return this.http.get<ApiResponse<any>>(this.apiUrl);
  }
}
