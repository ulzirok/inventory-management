import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { Inventory } from '../../models/inventory.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../auth/models/role.enum';

@Component({
  selector: 'app-inventory-list',
  imports: [
    TranslateModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss',
})
export class InventoryList {
  private authService = inject(AuthService)
  
  inventories = input<Inventory[]>([]);
  editInventory = output<number>()
  deleteInventory = output<number[]>()
  viewItems = output<number>()
  viewAllItems = output<void>()
  createInventory = output<void>()
  
  public isAdmin = computed(() => this.authService.hasRole(Role.ADMIN));
  dataSource = this.inventories;
  displayedColumns = ['select', 'customId', 'inventory', 'description', 'category', 'author']; //+картинка
  selection = new SelectionModel<Inventory>(true, []);
  private selectedCountSignal = signal(0);
  isSingleSelected = computed(() => this.selectedCountSignal() === 1);
  isAnySelected = computed(() => this.selectedCountSignal() > 0);
  
  updateSelectionCount() {
    this.selectedCountSignal.set(this.selection.selected.length);
  }
  
  isAllSelected() {
    return this.selection.selected.length === this.dataSource().length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource());
    }
    this.updateSelectionCount();
  }
  
  toggleRow(row: Inventory) {
    this.selection.toggle(row);
    this.updateSelectionCount();
  }

  create() {
    this.createInventory.emit()
  }

  edit() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id
    this.editInventory.emit(id)
    this.selection.clear();
  }

  delete() {
    if (!this.isAnySelected()) return;
    const ids = this.selection.selected.map(item => item.id);
    this.deleteInventory.emit(ids)
    this.selection.clear();
  }
  
  viewItem() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id
    this.viewItems.emit(id)
    this.selection.clear();
  }
  
  viewAllItem() {
    this.viewAllItems.emit()
  }

}
