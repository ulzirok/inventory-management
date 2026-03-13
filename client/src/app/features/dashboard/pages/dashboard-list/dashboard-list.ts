import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Inventory } from '../../../inventory/models/inventory.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryList } from '../../../inventory/components/inventory-list/inventory-list';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';
import { Loader } from '../../../../shared/components/loader/loader';
import { TableParams } from '../../../../core/models/tableParams.interface';

@Component({
  selector: 'app-dashboard-list',
  imports: [InventoryList, TranslateModule, Loader],
  templateUrl: './dashboard-list.html',
  styleUrl: './dashboard-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardList {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private inventoryService = inject(InventoryService);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  inventories = signal<Inventory[]>([]);
  total = signal(0);

  ngOnInit() {
    this.isLoading.set(true);
    this.loadInventories();
  }

  loadInventories() {
    const params: TableParams = { page: 1, limit: 10, sort: 'updatedAt', order: 'desc', search: '' };

    this.inventoryService.getAll(params).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.inventories.set(data.data);
        this.total.set(data.total);
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
        this.loadInventories();
      },
      error: (err) => { }
    });
  }

  onviewItems(id: number) {
    this.router.navigate([`/dashboard/${id}/items`]);
  }

  onviewChats(id: number) {
    this.router.navigate([`/inventory/${id}/chat`]);
  }

  onParamsChange(params: TableParams) {
    this.inventoryService.getAll(params).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.inventories.set(res.data);
      this.total.set(res.total);
    });
  }
}
