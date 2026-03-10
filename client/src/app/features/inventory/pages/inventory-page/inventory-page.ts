import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Inventory } from '../../models/inventory.interface';
import { InventoryService } from '../../services/inventory.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventoryList } from '../../components/inventory-list/inventory-list';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { Item } from '../../models/item.interface';
import { finalize, forkJoin } from 'rxjs';
import { Loader } from '../../../../shared/components/loader/loader';

@Component({
  selector: 'app-inventory-page',
  imports: [InventoryList, TranslateModule, Loader],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
})
export class InventoryPage implements OnInit {
  private inventoryService = inject(InventoryService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  isLoading = signal(false);
  inventories = signal<Inventory[]>([]);
  items = signal<Item[]>([]);
  sharedInventories = signal<Inventory[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    forkJoin({
      my: this.inventoryService.getMy(),
      shared: this.inventoryService.getShared()
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.inventories.set(data.my),
          this.sharedInventories.set(data.shared);
      },
      error: (err) => { }
    });
  }

  onCreateInventory(): void {
    this.router.navigate(['/inventory/create']);
  }

  onSettingsInventory(id: number) {
    this.router.navigate([`/inventory/${id}/details`]);
  }

  onDeleteInventory(ids: number[]) {
    this.inventoryService.delete(ids).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.notificationService.success(response.message);
        this.loadData();
      },
      error: (err) => { }
    });
  }

  onviewItems(id: number) {
    this.router.navigate([`/inventory/${id}/items`]);
  }
  
  onviewChats(id: number) {
    this.router.navigate([`/inventory/${id}/chat`]);
  }
}
