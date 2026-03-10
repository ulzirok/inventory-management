import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { InventoryChat } from '../inventory-chat/inventory-chat';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { WsService } from '../../../../core/services/ws.service';
import { filter, first } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../core/services/notification.service';
import { InventoryService } from '../../services/inventory.service';
import { Comment } from '../../models/comment.interface';

@Component({
  selector: 'app-inventory-shared-chat',
  imports: [MatCardModule, InventoryChat, TranslateModule ],
  templateUrl: './inventory-shared-chat.html',
  styleUrl: './inventory-shared-chat.scss',
})
export class InventorySharedChat implements OnInit {
  messages = signal<Comment[]>([]);
  
  private route = inject(ActivatedRoute)
  private ws = inject(WsService)
  private destroyRef = inject(DestroyRef)
  private notificationService = inject(NotificationService)
  private inventoryService = inject(InventoryService)
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadMessages();
    this.initChatWs(id)
  }

  loadMessages() {
    const id = this.route.snapshot.paramMap.get('id');
    this.inventoryService.getComment(Number(id)).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.messages.set(data)
    );
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
