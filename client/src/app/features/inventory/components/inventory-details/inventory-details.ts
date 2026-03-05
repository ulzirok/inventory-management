import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Inventory, InventoryFieldsDto } from '../../models/inventory.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ItemsList } from '../items-list/items-list';
import { Item, ItemDto } from '../../models/item.interface';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatListModule } from '@angular/material/list';
import { InventorySettings } from '../inventory-settings/inventory-settings';
import { InventoryFields } from '../inventory-fields/inventory-fields';

@Component({
  selector: 'app-inventory-details',
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule,
    ItemsList,
    MatListModule,
    InventorySettings,
    InventoryFields
  ],
  templateUrl: './inventory-details.html',
  styleUrl: './inventory-details.scss',
})
export class InventoryDetails implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private inventoryService = inject(InventoryService)
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService)

  items = signal<Item[]>([]);
  inventory = signal<Inventory | null>(null)
  
  ngOnInit(): void {
    this.loadInventory()
    this.loadItems()
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
    const inventoryId = this.route.snapshot.paramMap.get('id')
    if (inventoryId) {
      this.inventoryService.getItems(inventoryId).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        data => this.items.set(data)
      );
    }
  }
  
  onSaveField(payload: InventoryFieldsDto) {
    this.inventoryService.update(Number(this.inventory()!.id), payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.loadInventory();
        this.notificationService.success('Fields saved successfully.');
      },
      error: (err) => {}
    });
  }
  
  onEditInventory() {
    this.router.navigate([`/inventory/${Number(this.inventory()!.id)}/edit`])
  }
  
  onDeleteField(payload: InventoryFieldsDto) {
    this.inventoryService.update(Number(this.inventory()!.id), payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.loadInventory();
        this.notificationService.success('Field deleted.');
      },
      error: (err) => {}
    });
  }
  
  onCreateItem(item: ItemDto): void {    
    this.inventoryService.createItem(this.inventory()!.id, item).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.loadItems();
        this.notificationService.success('Item created successfully.');
      },
      error: (err) => {}
    })
  }
  
  onEditItem(): void {
    
  }

  onDeleteItem(ids: number[]) {
    
  }
  
  onViewDetailsItem(id: number) {
    
  }
}
