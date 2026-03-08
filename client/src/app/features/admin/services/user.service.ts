import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserDto } from '../models/user.interface';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/${id}`);
  }

  changeStatus(upload: UserDto): Observable<{ message: string; }> {
    return this.http.patch<{ message: string; }>(`${environment.apiUrl}/api/users/status`, upload);
  }

  changeRole(upload: UserDto): Observable<{ message: string; }> {
    return this.http.patch<{ message: string; }>(`${environment.apiUrl}/api/users/role`, upload);
  }

  delete(ids: number[]): Observable<{ message: string; }> {
    return this.http.post<{ message: string; }>(`${environment.apiUrl}/api/users/delete`, { ids });
  }
}
