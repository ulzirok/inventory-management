import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { Item } from '../../models/item.interface';

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
    MatCardModule
  ],
  templateUrl: './items-list.html',
  styleUrl: './items-list.scss',
})
export class ItemsList {

  items = input<Item[]>([]);
  createItem = output<void>()
  editItem = output<void>();
  deleteItem = output<number[]>();
  detailsItem = output<number>();
  
  dataSource = this.items;
  displayedColumns = ['select', 'динамические fields']; //динамические

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
    this.createItem.emit()
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
