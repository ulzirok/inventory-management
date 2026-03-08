import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { InventoryList } from '../../../inventory/components/inventory-list/inventory-list';
import { UsersList } from '../../components/users-list/users-list';
import { Inventory } from '../../../inventory/models/inventory.interface';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { Loader } from '../../../../shared/components/loader/loader';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-page',
  imports: [InventoryList, UsersList, Loader, TranslateModule],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage implements OnInit {
  private inventoryService = inject(InventoryService);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  inventories = signal<Inventory[]>([]);
  users = signal<User[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    forkJoin({
      users: this.userService.getAll(),
      inventories: this.inventoryService.getAll()
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.users.set(data.users),
        this.inventories.set(data.inventories);
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

  onChangeStatus(ids: number[]) {

  }

  onChangeRole(ids: number[]) {

  }

  onDeleteUsers(ids: number[]) {

  }

  onGetUser(id: number) {

  }
}
