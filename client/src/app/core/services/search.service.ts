import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment.prod';
import { Inventory } from '../../features/inventory/models/inventory.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);
  public results = signal<Inventory[]>([]);

  search(query: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/search`, { params: { query } }).pipe(
        tap(data => this.results.set(data)));
  }

  searchByTag(tag: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/search-by-tag`, { params: { tag } }).pipe(
      tap(data => this.results.set(data))); 
  }
}
