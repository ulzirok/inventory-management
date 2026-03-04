import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Inventory, InventoryFieldsDto, Tag } from '../models/inventory.interface';
import { environment } from '../../../../environment/environment.prod';
import { Item, ItemDto } from '../models/item.interface';

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

  getById(id: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${environment.apiUrl}/api/inventory/${id}`)
  }
  
  create(inventory: FormData): Observable<Inventory[]> {
    return this.http.post<Inventory[]>(`${environment.apiUrl}/api/inventory`, inventory)
  }
  
  update(id: number, inventory: InventoryFieldsDto): Observable<Inventory> {
    return this.http.patch<Inventory>(`${environment.apiUrl}/api/inventory/${id}`, inventory)
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
  
  getItems(inventoryId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.apiUrl}/api/items/${inventoryId}`)
  }
  
  getPublicItems(inventoryId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.apiUrl}/api/items/${inventoryId}/public`)
  }
  
  createItem(inventoryId: number, item: ItemDto): Observable<Item[]> {
    return this.http.post<Item[]>(`${environment.apiUrl}/api/items/inventory/${inventoryId}`, item)
  }
}
