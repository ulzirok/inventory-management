import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ItemsList } from '../../../inventory/components/items-list/items-list';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Item } from '../../../inventory/models/item.interface';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Inventory } from '../../../inventory/models/inventory.interface';
import { finalize, forkJoin } from 'rxjs';
import { Loader } from '../../../../shared/components/loader/loader';

@Component({
  selector: 'app-dashboard-items',
  imports: [ItemsList, Loader],
  templateUrl: './dashboard-items.html',
  styleUrl: './dashboard-items.scss',
})
export class DashboardItems implements OnInit{
  private inventoryService = inject(InventoryService);
  private route = inject(ActivatedRoute)
  private destroyRef = inject(DestroyRef);
  
  inventory = signal<Inventory | null>(null);
  items = signal<Item[]>([]);
  isLoading = signal(false);
  
  ngOnInit(): void {
    this.isLoading.set(true); 
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return
    
    forkJoin({
      inventory: this.inventoryService.getById(id),
      items: this.inventoryService.getPublicItems(id)
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(()=> this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.inventory.set(data.inventory)
        this.items.set(data.items)
      },
      error: (err) => {}
    })
  }
  
}
