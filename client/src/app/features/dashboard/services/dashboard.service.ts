import { inject, Injectable, signal } from '@angular/core';
import { Tag } from '../../search/models/search.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment.prod';
import { Observable } from 'rxjs';
import { Inventory } from '../../inventory/models/inventory.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient)

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/api/tags`)
  }
  
  getLatest(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/inventory/latest`)
  }
  
  getTop(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/inventory/top`)
  }
}
