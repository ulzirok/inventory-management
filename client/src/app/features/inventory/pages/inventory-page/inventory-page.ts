import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Inventory } from '../../models/inventory.interface';
import { InventoryService } from '../../services/inventory.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventoryList } from '../../components/inventory-list/inventory-list';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-inventory-page',
  imports: [InventoryList, TranslateModule],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
})
export class InventoryPage implements OnInit {
  private inventoryService = inject(InventoryService)
  private destroyRef = inject(DestroyRef);
  public inventories = signal<Inventory[]>([]);
  
  ngOnInit(): void {
    this.inventoryService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.inventories.set(data)
    );
  }
  
  
}
