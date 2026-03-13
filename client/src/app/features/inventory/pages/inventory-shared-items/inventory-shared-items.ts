import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ItemsList } from "../../components/items-list/items-list";
import { InventoryService } from '../../services/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { Inventory } from '../../models/inventory.interface';
import { Item, ItemDto } from '../../models/item.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-inventory-shared-items',
  imports: [ItemsList],
  templateUrl: './inventory-shared-items.html',
  styleUrl: './inventory-shared-items.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventorySharedItems implements OnInit {
  private inventoryService = inject(InventoryService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);

  inventory = signal<Inventory | null>(null);
  items = signal<Item[]>([]);

  ngOnInit(): void {
    this.loadInventory();
    this.loadItems();
  }

  loadInventory() {
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
  }

  loadItems() {
    const inventoryId = this.route.snapshot.paramMap.get('id');
    if (inventoryId) {
      this.inventoryService.getPublicItems(inventoryId).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        data => this.items.set(data)
      );
    }
  }

  onCreateItem(item: ItemDto): void {
    this.inventoryService.createItem(this.inventory()!.id, item).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notificationService.success('Item created.');
        this.loadItems();
      },
      error: (err) => { }
    });
  }

  onEditItem(item: any): void {
    const itemId = item.id;

    this.inventoryService.updateItem(itemId, item).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notificationService.success('Item updated.');
        this.loadItems();
      },
      error: (err) => { }
    });
  }

  onDeleteItem(ids: string[]) {
    this.inventoryService.deleteItem(ids).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.notificationService.success(response.message);
        this.loadItems();
      },
      error: (err) => { }
    });
  }
}
