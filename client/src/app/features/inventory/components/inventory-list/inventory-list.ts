import { Component, computed, inject, input, OnInit } from '@angular/core';
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
  public isAdmin = computed(() => this.authService.hasRole(Role.ADMIN));
  dataSource = computed(() => this.inventories());
  displayedColumns = ['select', 'customId', 'inventory', 'description', 'category', 'author']; //+картинка
  selection = new SelectionModel<Inventory>(true, []);

  isAllSelected() {
    return this.selection.selected.length === this.dataSource().length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource());
    }
  }

  viewItems() {

  }

  create() {

  }

  edit() {

  }

  delete() {

  }

}
