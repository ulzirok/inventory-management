import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../features/auth/models/user.interface';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Role } from '../../features/auth/models/role.enum';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private currentUser = signal<User | null>(null);

  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/auth/register`, user);
  }

  login(user: User): Observable<User> {
    return this.http.post<{ token: string; }>(`${environment.apiUrl}/api/auth/login`, user).pipe(
      tap(response => this.tokenService.setToken(response.token)),
      switchMap(() => this.getProfile())
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/auth/me`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  getToken(): string {
    return this.tokenService.getToken() || '';
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  getRole(): Role | null {
    return this.currentUser()?.role ?? null;
  }

  hasRole(role: Role): boolean {
    return this.currentUser()?.role === role;
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUser.set(null);
  }
}
