import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrentPageService {
  private inventoryId: number | null = null;

  setInventoryId(id: number | null) {
    this.inventoryId = id;
  }

  getInventoryId(): number | null {
    return this.inventoryId;
  }

  clear() {
    this.inventoryId = null;
  }
}