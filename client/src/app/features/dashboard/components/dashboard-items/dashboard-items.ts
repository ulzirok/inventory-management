import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ItemsList } from '../../../inventory/components/items-list/items-list';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Item } from '../../../inventory/models/item.interface';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Inventory } from '../../../inventory/models/inventory.interface';

@Component({
  selector: 'app-dashboard-items',
  imports: [ItemsList],
  templateUrl: './dashboard-items.html',
  styleUrl: './dashboard-items.scss',
})
export class DashboardItems {
  private inventoryService = inject(InventoryService);
  private route = inject(ActivatedRoute)
  private destroyRef = inject(DestroyRef);
  
  inventory = signal<Inventory | null>(null);
  items = signal<Item[]>([]);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.inventoryService.getById(id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        (data) => {
          this.inventory.set(data);
        }
      );
    }
    
    const inventoryId = this.route.snapshot.paramMap.get('id');
    if (inventoryId) {
      this.inventoryService.getPublicItems(inventoryId).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        data => this.items.set(data)
      );
    }
  }
}
