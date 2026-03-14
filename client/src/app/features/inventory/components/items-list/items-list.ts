import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsList {
  inventory = input<Inventory | null>(null);
  items = input<Item[]>([]);
  isEditable = input<boolean>(false);
  createItem = output<ItemDto>();
  editItem = output<void>();
  deleteItem = output<string[]>();
  viewItemDetails = output<string>();

  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  isAdmin = computed(() => this.authService.hasRole(Role.ADMIN));
  canManage = computed(() => this.isEditable() && (this.isAdmin() || this.isEditable()));

  activeFields = computed(() => {
    const inventory = this.inventory();
    if (!inventory) return [];

    return Object.entries(FIELD_MAPPING)
      .filter(([inventoryKey]) => inventory[inventoryKey as InventoryFieldKey])
      .map(([inventoryKey, itemKey]) => ({
        label: inventory[inventoryKey as InventoryFieldKey] as string,
        columnDef: itemKey,
        type: this.detectFieldType(itemKey)
      }));
  });

  displayedColumns = computed(() => {
    const fields = this.activeFields().map(field => field.columnDef);
    return this.canManage() ? ['select', 'customId', ...fields] : ['customId', ...fields];
  });
  dataSource = computed(() => this.items());

  selection = new SelectionModel<Item>(true, []);
  private selectedCount = signal(0);
  isSingleSelected = computed(() => this.selectedCount() === 1);
  hasSelection = computed(() => this.selectedCount() > 0);

  updateSelectionCount() {
    this.selectedCount.set(this.selection.selected.length);
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

  toggleRow(item: Item) {
    this.selection.toggle(item);
    this.updateSelectionCount();
  }

  detectFieldType(key: string): FieldType {
    if (key.startsWith('integer')) return 'number';
    if (key.startsWith('boolean')) return 'boolean';
    if (key.startsWith('text')) return 'text';
    return 'string';
  }

  create() {
    const dialogRef = this.dialog.open(ItemCreate, {
      data: {
        inventory: this.inventory(),
        activeFields: this.activeFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.createItem.emit(result);
    });
  }

  edit() {
    if (!this.isSingleSelected()) return;
    const item = this.selection.selected[0];
    const dialogRef = this.dialog.open(ItemCreate, {
      data: {
        inventory: this.inventory(),
        activeFields: this.activeFields(),
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.editItem.emit(result);
      this.selection.clear();
    });

  }

  delete() {
    if (!this.hasSelection()) return;
    const ids = this.selection.selected.map(item => item.id);
    this.deleteItem.emit(ids);
    this.selection.clear();
    this.updateSelectionCount();
  }
  
  viewItem() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.viewItemDetails.emit(id);
    this.selection.clear();
    this.updateSelectionCount();
  }
  
}
