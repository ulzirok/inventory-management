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
import { User, UserDto } from '../../models/user.interface';
import { Loader } from '../../../../shared/components/loader/loader';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TableParams } from '../../../../core/models/tableParams.interface';

@Component({
  selector: 'app-admin-page',
  imports: [InventoryList, UsersList, Loader, TranslateModule],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage implements OnInit {
  private inventoryService = inject(InventoryService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  inventories = signal<Inventory[]>([]);
  users = signal<User[]>([]);
  isLoading = signal(false);
  inventorytotal = signal(0);
  usertotal = signal(0);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    const params: TableParams = { page: 1, limit: 10, sort: 'id', order: 'desc', search: '' };

    forkJoin({
      users: this.userService.getAll(params),
      inventories: this.inventoryService.getAll(params)
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.users.set(data.users.data),
        this.usertotal.set(data.inventories.total);
        this.inventories.set(data.inventories.data);
        this.inventorytotal.set(data.inventories.total);
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

  onChangeStatus(upload: UserDto) {
    this.userService.changeStatus(upload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.notificationService.success(response.message);
        this.loadData();
      },
      error: (err) => { }
    });
  }

  onChangeRole(upload: UserDto) {
    this.userService.changeRole(upload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.notificationService.success(response.message);
        const currentUserId = this.authService.currentUser();
        if (currentUserId && upload.ids.includes(currentUserId.id) && upload.role !== 'ADMIN') {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          return;
        }
        this.loadData();
      },
      error: (err) => { }
    });
  }

  onDeleteUsers(ids: number[]) {
    this.userService.delete(ids).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.notificationService.success(response.message);
        this.loadData();
      },
      error: (err) => { }
    });
  }

  onGetUser(id: number) {
    this.router.navigate([`users/${id}`]);
  }
  
  onviewChats(id: number) {
    this.router.navigate([`/inventory/${id}/chat`]);
  }

  onInventoryParamsChange(params: TableParams) {
    this.inventoryService.getAll(params).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.inventories.set(res.data);
      this.inventorytotal.set(res.total);
    });
    
  }
  
  onUsersParamsChange(params: TableParams) {
    this.userService.getAll(params).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.users.set(res.data);
      this.usertotal.set(res.total);
    });
  }
}
