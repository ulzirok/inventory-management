import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Inventory } from '../../../inventory/models/inventory.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-dashboard-list',
  imports: [
    TranslateModule,
    TranslateModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './dashboard-list.html',
  styleUrl: './dashboard-list.scss',
})
export class DashboardList {
  private router = inject(Router)
  private inventoryService = inject(InventoryService)
  private destroyRef = inject(DestroyRef);
  
  inventories = signal<Inventory[]>([]);
  dataSource = this.inventories;
  displayedColumns = ['select', 'customId', 'inventory', 'description', 'category', 'author', 'image']; //+картинка
  selection = new SelectionModel<Inventory>(true, []);
  private selectedCountSignal = signal(0);
  isSingleSelected = computed(() => this.selectedCountSignal() === 1);
  isAnySelected = computed(() => this.selectedCountSignal() > 0);
  
  ngOnInit() {
    this.inventoryService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.inventories.set(data)
    );
  }

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
  
  viewItem() {
    const id = this.selection.selected[0].id
    this.router.navigate([`/inventory/${id}/item`]);
  }

  viewAllItem(): void {
    this.router.navigate(['/inventory/items']);
  }
}
