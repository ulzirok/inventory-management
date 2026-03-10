import { inject, Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  private socket!: WebSocket;
  private tokenService = inject(TokenService)

  public isConnected$ = new BehaviorSubject<boolean>(false);
  
  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const token = this.tokenService.getToken();
    // this.socket = new WebSocket(`ws://localhost:5000/api/chat?token=${token}`);
    this.socket = new WebSocket(`wss://inventory-management-mww7.onrender.com/api/chat?token=${token}`);

    this.socket.onopen = () => this.isConnected$.next(true);
    this.socket.onclose = () => this.isConnected$.next(false);
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(data));
  }
  
  onMessage(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.onmessage = (event) => callback(JSON.parse(event.data));
  }

  disconnect() {
    this.socket?.close();
    this.isConnected$.next(false);
  }
}