import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;
  private socketUrl: string = environment.socketUrl;


  constructor() { }

  // Manual connection trigger
  connectSocket(): void {
    if (!this.socket) {
      this.socket = io(this.socketUrl, {
        autoConnect: false
      });
      this.socket.connect();
      console.log('socket connected');
    }
  }

  disconnectSocket(): void {
    this.socket?.disconnect();
    console.log('socket disconnected');
  }

  joinUser(userName: string) {    
    this.socket?.emit('joinUser', userName);
  }

  sendMessage(msg: string): void {
    this.socket?.emit('sendMessage', msg);
  }

  getAllUsers(): any {
    return new Observable(observer => {
      this.socket?.on('allUsers', (users: any) => {
        observer.next(users);
      });
    });
  }

  getMessages(): Observable<string> {
    return new Observable(observer => {
      this.socket?.on('receiveMessage', (msg: string) => {
        observer.next(msg);
      });
    });
  }
}
