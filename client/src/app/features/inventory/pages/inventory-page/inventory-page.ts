import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { TableParams } from '../../../../core/models/tableParams.interface';

@Component({
  selector: 'app-inventory-page',
  imports: [InventoryList, TranslateModule, Loader],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  myTotal = signal(0);
  sharedTotal = signal(0);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    const params: TableParams = { page: 1, limit: 10, sort: 'updatedAt', order: 'desc', search: '' };

    forkJoin({
      my: this.inventoryService.getMy(params),
      shared: this.inventoryService.getShared(params)
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (res) => {
        this.inventories.set(res.my.data);
        this.myTotal.set(res.my.total);
        this.sharedInventories.set(res.shared.data);
        this.sharedTotal.set(res.shared.total);
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

  onMyParamsChange(params: TableParams) {
    this.inventoryService.getMy(params).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.inventories.set(res.data);
      this.myTotal.set(res.total);
    });
  }

  onSharedParamsChange(params: TableParams) {
    this.inventoryService.getShared(params).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.sharedInventories.set(res.data);
      this.sharedTotal.set(res.total);
    });
  }
}
