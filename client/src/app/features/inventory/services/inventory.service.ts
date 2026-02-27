import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory.interface';
import { environment } from '../../../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/inventory`);
  }

  getById(id: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/api/inventory/${id}`)
  }
  
  delete(ids: number[]) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/api/inventory/delete`, { ids })
  }
}
