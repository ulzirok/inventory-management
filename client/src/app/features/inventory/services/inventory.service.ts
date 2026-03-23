import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Inventory, InventoryFieldsDto, Tag } from '../models/inventory.interface';
import { environment } from '../../../../environment/environment';
import { Item, ItemDto } from '../models/item.interface';
import { Comment } from '../models/comment.interface';
import { TableParams } from '../../../core/models/tableParams.interface';
import { SalesforceDto } from '../../auth/models/user.interface';


@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);

  getAll(params: TableParams): Observable<{ data: Inventory[], total: number; }> {
    const httpParams = new HttpParams({
      fromObject: {
        page: params.page.toString(),
        limit: params.limit.toString(),
        sort: params.sort || '',
        order: params.order || '',
        search: params.search || ''
      }
    });

    return this.http.get<{ data: Inventory[], total: number; }>(
      `${environment.apiUrl}/api/inventory`, { params: httpParams }
    );
  }

  getMy(params: TableParams): Observable<{ data: Inventory[], total: number; }> {
    const httpParams = new HttpParams({
      fromObject: {
        page: params.page.toString(),
        limit: params.limit.toString(),
        sort: params.sort || '',
        order: params.order || '',
        search: params.search || ''
      }
    });

    return this.http.get<{ data: Inventory[], total: number; }>(
      `${environment.apiUrl}/api/inventory/my`, { params: httpParams }
    );
  }

  getShared(params: TableParams): Observable<{ data: Inventory[], total: number; }> {
    const httpParams = new HttpParams({
      fromObject: {
        page: params.page.toString(),
        limit: params.limit.toString(),
        sort: params.sort || '',
        order: params.order || '',
        search: params.search || ''
      }
    });

    return this.http.get<{ data: Inventory[], total: number; }>(
      `${environment.apiUrl}/api/inventory/shared`, { params: httpParams }
    );
  }

  getById(id: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${environment.apiUrl}/api/inventory/info/${id}`);
  }

  create(inventory: FormData): Observable<Inventory[]> {
    return this.http.post<Inventory[]>(`${environment.apiUrl}/api/inventory`, inventory);
  }

  update(id: number, inventory: FormData | InventoryFieldsDto): Observable<Inventory> {
    return this.http.patch<Inventory>(`${environment.apiUrl}/api/inventory/${id}`, inventory);
  }

  delete(ids: number[]): Observable<{ message: string; }> {
    return this.http.post<{ message: string; }>(`${environment.apiUrl}/api/inventory/delete`, { ids });
  }
  
  generateApiToken(id: number): Observable<{ message: string; token: string}> {
    return this.http.post<{ message: string; token: string}>(`${environment.apiUrl}/api/inventory/${id}/generate-token`, { });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/api/categories`);
  }

  getTags(query: string = ''): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/api/tags`, { params: { query } });
  }

  getItems(inventoryId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.apiUrl}/api/items/${inventoryId}`);
  }
  
  getItem(id: string): Observable<Item> {
    return this.http.get<Item>(`${environment.apiUrl}/api/items/item/${id}`);
  }

  getPublicItems(inventoryId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.apiUrl}/api/items/public/${inventoryId}`);
  }

  createItem(inventoryId: number, item: ItemDto): Observable<Item[]> {
    return this.http.post<Item[]>(`${environment.apiUrl}/api/items/inventory/${inventoryId}`, item);
  }

  updateItem(id: string, item: ItemDto): Observable<Item> {
    return this.http.patch<Item>(`${environment.apiUrl}/api/items/${id}`, item);
  }

  deleteItem(ids: string[]) {
    return this.http.post<{ message: string; }>(`${environment.apiUrl}/api/items/delete`, { ids });
  }

  getComment(inventoryId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/api/comment/${inventoryId}`);
  }
  
  likeItem(itemId: string): Observable<{ liked: boolean; }> {
    return this.http.post<{ liked: boolean; }>(`${environment.apiUrl}/api/likes/items/${itemId}`, {});
  }
}
