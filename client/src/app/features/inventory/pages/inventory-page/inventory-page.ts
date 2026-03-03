import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Inventory } from '../../models/inventory.interface';
import { InventoryService } from '../../services/inventory.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventoryList } from '../../components/inventory-list/inventory-list';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-inventory-page',
  imports: [InventoryList, TranslateModule],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
})
export class InventoryPage implements OnInit {
  private inventoryService = inject(InventoryService)
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  public inventories = signal<Inventory[]>([]);
  
  ngOnInit(): void {
    this.loadInventories()
  }
  
  loadInventories() {
    this.inventoryService.getMy().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.inventories.set(data)
    );
  }
  
  onCreateInventory(): void {
    this.router.navigate(['/inventory/create'])
  }
  
  onDetailsInventory(id: number) {
    this.router.navigate([`/inventory/${id}/details`])
  }
  
  onDeleteInventory(ids: number[]) {
    this.inventoryService.delete(ids).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => { 
        this.notificationService.success(response.message);
        this.loadInventories()
      },
      error: () => { }
    })
  }
  
  onviewItems(id: number) {
    this.router.navigate([`/inventory/${id}/item`])
  }
  
  onViewAllItems(): void {
    this.router.navigate(['/inventory/items'])
  }
  
}
