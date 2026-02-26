import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { User } from '../../features/auth/models/user.interface';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environment/environment.prod';
import { Role } from '../../features/auth/models/role.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  private currentUser = signal<User | null>(null);
  private http = inject(HttpClient)
  
  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.getProfile().subscribe();
    }
  }
  
  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/auth/register`, user)
  }
  
  login(user: User): Observable<User> {
    return this.http.post<{ token: string; }>(`${environment.apiUrl}/api/auth/login`, user).pipe(
      tap(
        (response) => {
          this.token = response.token;
          localStorage.setItem('token', response.token)
        }
      ),
      switchMap(() => this.getProfile())
    )
  }
  
  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/auth/me`).pipe(
      tap(user => {
        this.currentUser.set(user)
      })
    );
  }
  
  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token') || '';
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  getRole(): Role | null {
    return this.currentUser()?.role ?? null;
  }
  
  hasRole(role: Role): boolean {
    return this.currentUser()?.role === role;
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.token = '';
    this.currentUser.set(null)
  }
}
