import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Inventory } from '../../../inventory/models/inventory.interface';
@Component({
  selector: 'app-top-inventory',
  imports: [MatCardModule, MatTableModule, CommonModule, TranslateModule],
  templateUrl: './top-inventory.html',
  styleUrl: './top-inventory.scss',
})
export class TopInventory {
  topInventory = input<Inventory[]>([])
  displayedColumns = ['inventory', 'items', 'owner'];
  
  dataSource = computed(() => {
    return this.topInventory().map(item => ({
      inventory: item.title,
      owner: item.author?.email || '',
      items: item._count?.items ?? 0
    }))
  })
}
