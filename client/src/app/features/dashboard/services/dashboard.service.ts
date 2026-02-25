import { inject, Injectable, signal } from '@angular/core';
import { Tag } from '../../search/models/search.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient)

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/api/tags`)
    }
}
