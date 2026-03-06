import { Component, computed, inject, input, output, signal } from '@angular/core';
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
import { Item } from '../../models/item.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

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
  inventories = input<Inventory[]>([]);
  isEditable = input<boolean>(false);
  showViewItems = input<boolean>(true); 
  settingsInventory = output<number>()
  deleteInventory = output<number[]>()
  viewItems = output<number>()
  viewAllItems = output<void>()
  createInventory = output<void>()
  
  private authService = inject(AuthService)
  private dialog = inject(MatDialog);
  
  public isAdmin = computed(() => this.authService.hasRole(Role.ADMIN));
  canManage = computed(() => this.isAdmin() || this.isEditable());
  dataSource = computed(() => this.inventories());
  
  displayedColumns = ['select', 'customId', 'inventory', 'description', 'category', 'author', 'image'];
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
  
  toggleRow(inventory: Inventory) {
    this.selection.toggle(inventory);
    this.updateSelectionCount();
  }

  create() {
    this.createInventory.emit()
  }

  settings() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id
    this.settingsInventory.emit(id)
    this.selection.clear();
    this.updateSelectionCount(); 
  }

  delete() {
    if (!this.isAnySelected()) return;
    const dialogRef = this.dialog.open(ConfirmDialog)
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      const ids = this.selection.selected.map(item => item.id);
      this.deleteInventory.emit(ids);
      this.selection.clear();
      this.updateSelectionCount(); 
    })
  }
  
  viewItem() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id
    this.viewItems.emit(id)
    this.selection.clear();
    this.updateSelectionCount(); 
  }
}
