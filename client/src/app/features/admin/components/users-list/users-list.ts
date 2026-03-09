import { Component, computed, inject, input, output, signal } from '@angular/core';
import { User, UserDto } from '../../models/user.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-users-list',
  imports: [
    TranslateModule,
    MatTableModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  users = input<User[]>([]);
  changeUserStatus = output<UserDto>();
  changeUserRole = output<UserDto>();
  deleteUsersById = output<number[]>();
  getUserById = output<number>();
  
  private dialog = inject(MatDialog)
  
  dataSource = computed(() => this.users());
  displayedColumns = ['select', 'name', 'email', 'status', 'role'];
  selection = new SelectionModel<User>(true, []);
  private selectedCount = signal(0);
  isSingleSelected = computed(() => this.selectedCount() === 1);
  hasSelection = computed(() => this.selectedCount() > 0);

  updateSelectionCount() {
    this.selectedCount.set(this.selection.selected.length);
  }

  isAllSelected() {
    return this.dataSource().length > 0 && this.selection.selected.length === this.dataSource().length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource());
    }
    this.updateSelectionCount();
  }

  toggleRow(user: User) {
    this.selection.toggle(user);
    this.updateSelectionCount();
  }
  
  changeStatus() {
    if (!this.hasSelection()) return;
    const selectedUsers = this.selection.selected;
    const upload: UserDto = {
      ids: selectedUsers.map(user => user.id),
      isBlocked: selectedUsers.some(user => !user.isBlocked)
    };
    this.changeUserStatus.emit(upload);
    this.selection.clear();
    this.updateSelectionCount();
  }
  
  changeRole() {
    if (!this.hasSelection()) return;
    const selectedUsers = this.selection.selected;
    const hasUser = selectedUsers.some(user => user.role === 'USER');
    const upload = {
      ids: selectedUsers.map(u => u.id),
      role: hasUser ? 'ADMIN' : 'USER'
    }
    this.changeUserRole.emit(upload);
    this.selection.clear();
    this.updateSelectionCount();
  }
  
  deleteUsers() {
    if (!this.hasSelection()) return;
    const dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const ids = this.selection.selected.map(item => item.id);
      this.deleteUsersById.emit(ids);
      this.selection.clear();
      this.updateSelectionCount();
    });
  }
  
  getUser() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.getUserById.emit(id);
    this.selection.clear();
    this.updateSelectionCount();
  }

}
