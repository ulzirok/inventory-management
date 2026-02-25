import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment.prod';
import { TopInventory } from '../../features/inventory/models/topInventory.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  results = signal <TopInventory[]>([]);
  
  private http = inject(HttpClient);

  search(query: string): Observable<TopInventory[]> {
    return this.http.get<TopInventory[]>(`${environment.apiUrl}/api/search`, { params: { query } })
      .pipe(tap(data => this.results.set(data)));
  }

  searchByTag(tag: string): Observable<TopInventory[]> {
    return this.http.get<TopInventory[]>(`${environment.apiUrl}/api/search-by-tag`, { params: { tag  } })
      .pipe(tap(data => this.results.set(data))); 
  }
}
