import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Inventory } from '../../../inventory/models/inventory.interface';
@Component({
  selector: 'app-top-inventory',
  imports: [MatCardModule, MatTableModule, CommonModule, TranslateModule],
  templateUrl: './top-inventory.html',
  styleUrl: './top-inventory.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopInventory {
  topInventory = input<Inventory[]>([])
  dataSource = computed(() => this.topInventory());
  displayedColumns = ['title', 'items', 'owner', 'image'];
}
