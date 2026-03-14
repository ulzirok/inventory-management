import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FIELD_MAPPING, FieldType, Item } from '../../models/item.interface';
import { MatButtonModule } from '@angular/material/button';
import { InventoryFieldKey } from '../../models/inventory.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-details',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './item-details.html',
  styleUrl: './item-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private inventoryService = inject(InventoryService);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);

  item = signal<Item | null>(null);

  activeFields = computed(() => {
    const item = this.item();
    const inventory = item?.inventory;
    if (!item || !inventory) return [];

    return Object.entries(FIELD_MAPPING)
      .filter(([inventoryKey]) => inventory[inventoryKey as InventoryFieldKey])
      .map(([inventoryKey, itemKey]) => ({
        label: inventory[inventoryKey as InventoryFieldKey] as string,
        value: item[itemKey as keyof Item],
        type: this.detectFieldType(itemKey)
      }))
      .filter(field => field.value !== null && field.value !== undefined);
  });

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.inventoryService.getItem(itemId).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        data => this.item.set(data)
      );
    }
  }

  detectFieldType(key: string): FieldType {
    if (key.startsWith('integer')) return 'number';
    if (key.startsWith('boolean')) return 'boolean';
    if (key.startsWith('text')) return 'text';
    return 'string';
  }

  like(id: string) {
    this.inventoryService.likeItem(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        this.item.update(prev => {
          if (!prev) return null;
          return {
            ...prev,
            isLiked: res.liked,
            _count: {
              ...prev._count,
              likes: res.liked ? prev._count.likes + 1 : prev._count.likes - 1
            }
          };
        });
      },
      error: (err) => { }
    });
  }
  
  goBack() {
    this.location.back();
  }
}
