import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.prod';
import { Search } from '../models/search.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient)

  search(query: string): Observable<Search[]> {
    return this.http.get<Search[]>(`${environment.apiUrl}/api/search`, {
      params: { query }
    });
  }
}
