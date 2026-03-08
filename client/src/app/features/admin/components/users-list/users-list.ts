import { Component, computed, inject, input, output, signal } from '@angular/core';
import { User } from '../../models/user.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

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
  changeUserStatus = output<number[]>();
  changeUserRole = output<number[]>();
  deleteUsersById = output<number[]>();
  getUserById = output<number>();
  
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
    
  }
  
  changeRole() {
    
  }
  
  deleteUsers() {
    
  }
  
  getUser() {
    
  }
  
}
