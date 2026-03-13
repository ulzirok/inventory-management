import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Inventory } from '../../../inventory/models/inventory.interface';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
@Component({
  selector: 'app-last-inventory',
  imports: [
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatButtonModule,
    TranslateModule,
    MatIconModule,
    RouterModule,
    MarkdownComponent
  ],
  templateUrl: './last-inventory.html',
  styleUrl: './last-inventory.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LastInventory {
  latestInventory = input<Inventory[]>([]);
  dataSource = computed(() => this.latestInventory());
  displayedColumns = ['title', 'description', 'date', 'image'];
}
