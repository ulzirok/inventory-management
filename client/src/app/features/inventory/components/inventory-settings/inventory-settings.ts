import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Inventory } from '../../models/inventory.interface';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-inventory-settings',
  imports: [
    TranslateModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MarkdownComponent
  ],
  templateUrl: './inventory-settings.html',
  styleUrl: './inventory-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventorySettings {
  inventory = input<Inventory | null>(null)
  editInventory = output<void>()
  
  edit() {
    this.editInventory.emit()
  }
}
