import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Inventory, Tag } from '../models/inventory.interface';
import { environment } from '../../../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/inventory`);
  }
  getMy(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/inventory/my`);
  }

  getById(id: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/inventory/${id}`)
  }
  
  create(inventory: FormData): Observable<Inventory[]> {
    return this.http.post<Inventory[]>(`${environment.apiUrl}/api/inventory`, inventory)
  }
  
  delete(ids: number[]) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/api/inventory/delete`, { ids })
  }
  
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/api/categories`)
  }
  
  getTags(query: string = ''): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/api/tags`, { params: { query } })
  }
}
