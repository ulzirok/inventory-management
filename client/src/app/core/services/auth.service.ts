import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../features/auth/models/user.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  private http = inject(HttpClient)
  
  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/auth/register`, user)
  }
  
  login(user: User): Observable<{token: string}> {
    return this.http.post<{ token: string; }>(`${environment.apiUrl}/api/auth/login`, user).pipe(
      tap(
        (response) => {
          this.token = response.token;
          localStorage.setItem('token', response.token)
        }
      )
    )
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
  
  logout() {
    localStorage.removeItem('token');
  }
}
