import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Inventory, InventoryFieldsDto } from '../../models/inventory.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Item, ItemDto } from '../../models/item.interface';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatListModule } from '@angular/material/list';
import { WsService } from '../../../../core/services/ws.service';
import { Comment } from '../../models/comment.interface';
import { filter, first } from 'rxjs';
import { ItemsList } from '../../components/items-list/items-list';
import { InventorySettings } from '../../components/inventory-settings/inventory-settings';
import { InventoryFields } from '../../components/inventory-fields/inventory-fields';
import { InventoryAccess } from '../../components/inventory-access/inventory-access';
import { InventoryCustomId } from '../../components/inventory-custom-id/inventory-custom-id';
import { InventoryChat } from '../../components/inventory-chat/inventory-chat';

@Component({
  selector: 'app-inventory-details',
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule,
    ItemsList,
    MatListModule,
    InventorySettings,
    InventoryFields,
    InventoryAccess,
    InventoryCustomId,
    InventoryChat
  ],
  templateUrl: './inventory-details.html',
  styleUrl: './inventory-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryDetails implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private inventoryService = inject(InventoryService)
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService)
  private ws = inject(WsService)

  items = signal<Item[]>([]);
  inventory = signal<Inventory | null>(null)
  messages = signal<Comment[]>([])
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.loadInventory()
    this.loadItems()
    this.loadMessages()
    this.initChatWs(id)
  }
  
  loadMessages() {
    const id = this.route.snapshot.paramMap.get('id');
    this.inventoryService.getComment(Number(id)).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.messages.set(data)
    )
  }
  
  loadInventory() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.inventoryService.getById(id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        (data) => {
          this.inventory.set(data);
        }
      );
    }
  }
  
  loadItems() {
    const inventoryId = this.route.snapshot.paramMap.get('id')
    if (inventoryId) {
      this.inventoryService.getItems(inventoryId).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        data => this.items.set(data)
      );
    }
  }
  
  initChatWs(roomId: string | null) {
    if (!roomId) return;

    this.ws.connect();

    this.ws.isConnected$.pipe(
      filter(connected => connected === true),
      first(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.ws.send({ method: 'JOIN_ROOM', roomId });
    });

    this.ws.onMessage((data) => {
      if (data.method === 'NEW_MESSAGE') {
        this.messages.update(msgs => [...msgs, data.message]);
      }

      if (data.method === 'ERROR') {
        this.notificationService.error(data.message || 'Something went wrong');
      }
    });
  }
  
  onSaveField(payload: InventoryFieldsDto) {
    this.inventoryService.update(Number(this.inventory()!.id), payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.loadInventory();
        this.notificationService.success('Fields saved.');
      },
      error: (err) => {}
    });
  }
  
  onEditInventory() {
    this.router.navigate([`/inventory/${Number(this.inventory()!.id)}/edit`])
  }
  
  onDeleteField(payload: InventoryFieldsDto) {
    this.inventoryService.update(Number(this.inventory()!.id), payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.loadInventory();
        this.notificationService.success('Field deleted.');
      },
      error: (err) => {}
    });
  }
  
  onCreateItem(item: ItemDto): void {    
    this.inventoryService.createItem(this.inventory()!.id, item).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notificationService.success('Item created.');
        this.loadItems();
      },
      error: (err) => {}
    })
  }
  
  onEditItem(item: any): void {
    const itemId = item.id
    
    this.inventoryService.updateItem(itemId, item).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notificationService.success('Item updated.');
        this.loadItems();
      },
      error: (err) => { }
    })
  }

  onDeleteItem(ids: string[]) {
    this.inventoryService.deleteItem(ids).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.notificationService.success(response.message)
        this.loadItems()
      },
      error: (err)=> {}
    })
  }
  
  onViewItemDetails(id: string) {
    this.router.navigate([`inventory/${id}/item`]);
  }
  
  onSaveAccess(payload: FormData) {
    const id = Number(this.inventory()!.id)
    this.inventoryService.update(id, payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.loadInventory();
        this.notificationService.success('Inventory access changed.');
      },
      error: (err) => { }
    });
  }
  
  onSaveCustomId(payload: FormData) {
    const id = Number(this.inventory()!.id);
    this.inventoryService.update(id, payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.loadInventory();
        this.notificationService.success('Inventory customID changed.');
      },
      error: (err) => { }
    });
  }
  
  onSendMessage(messageText: string) {
    this.ws.send({
      method: 'SEND_MESSAGE',
      text: messageText
    });
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }
}
