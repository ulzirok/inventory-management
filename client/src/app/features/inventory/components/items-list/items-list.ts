import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { FIELD_MAPPING, FieldType, Item, ItemDto } from '../../models/item.interface';
import { Inventory, InventoryFieldKey } from '../../models/inventory.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ItemCreate } from '../item-create/item-create';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../auth/models/role.enum';

@Component({
  selector: 'app-items-list',
  imports: [
    TranslateModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './items-list.html',
  styleUrl: './items-list.scss',
})
export class ItemsList {
  inventory = input<Inventory | null>(null);
  items = input<Item[]>([]);
  isEditable = input<boolean>(false);
  createItem = output<ItemDto>()
  editItem = output<void>();
  deleteItem = output<number[]>();
  detailsItem = output<number>();
  
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  
  public isAdmin = computed(() => this.authService.hasRole(Role.ADMIN));
  canManage = computed(() => this.isAdmin() || this.isEditable());
  
  activeFields = computed(() => {
    const inventory = this.inventory()
    if (!inventory) return []
    
    return Object.entries(FIELD_MAPPING)
      .filter(([inventoryKey]) => inventory[inventoryKey as InventoryFieldKey])
      .map(([inventoryKey, elKey]) => ({
        label: inventory[inventoryKey as InventoryFieldKey] as string,
        columnDef: elKey,
        type: this.detectFieldType(elKey)
      }))
  })
  
  detectFieldType(key: string): FieldType {
    if (key.startsWith('integer')) return 'number'
    if (key.startsWith('boolean')) return 'boolean'
    if (key.startsWith('text')) return 'text';
    return 'string'
   }
  
  displayedColumns = computed(() => {
    return ['select', ...this.activeFields().map(field => field.columnDef)]
  })
  dataSource = this.items;

  selection = new SelectionModel<Item>(true, []);
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

  toggleRow(row: Item) {
    this.selection.toggle(row);
    this.updateSelectionCount();
  }

  create() {
    const dialogRef = this.dialog.open(ItemCreate, {
      data: {
        inventory: this.inventory(),
        activeFields: this.activeFields()
      }
    })
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      this.createItem.emit(result)
    })
  }
  
  edit() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.editItem.emit();
    this.selection.clear();
  }
  
  delete() {
    if (!this.isAnySelected()) return;
    const ids = this.selection.selected.map(item => Number(item.id));
    this.deleteItem.emit(ids);
    this.selection.clear();
  }
  
  details() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.detailsItem.emit(Number(id));
    this.selection.clear();
  }
}
