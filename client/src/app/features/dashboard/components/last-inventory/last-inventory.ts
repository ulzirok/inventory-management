import { CommonModule } from '@angular/common';
import { Component, computed, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Inventory } from '../../../inventory/models/inventory.interface';
@Component({
  selector: 'app-last-inventory',
  imports: [MatCardModule, MatTableModule, CommonModule, MatButtonModule, TranslateModule],
  templateUrl: './last-inventory.html',
  styleUrl: './last-inventory.scss',
})
export class LastInventory {
  latestInventory = input<Inventory[]>([]);
  dataSource = computed(() => this.latestInventory());
  displayedColumns = ['inventory', 'description', 'author', 'date'];
}
