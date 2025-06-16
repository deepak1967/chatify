import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { fromEvent } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: Socket
  private socketUrl: string = environment.socketUrl;
  public socketIdSubject = new Subject<string>();

  socketIdObservable$ = this.socketIdSubject.asObservable();

  constructor() { }

  // Manual connection trigger
  connectSocket(): any {
    this.socket = io(this.socketUrl, {
      autoConnect: false
    });

    this.socket.on("connect", () => {
      const id: any = this.socket!.id;
      this.socketIdSubject.next(id)
    });

    this.socket.connect();
  }

  disconnectSocket(): void {
    this.socket?.disconnect();
    console.log('socket disconnected');
  }



  sendMessage(chatMessage: { sender: string, content: string }, room:any): void {
    this.socket?.emit('sendMessage', chatMessage, room);
  }


  receiveMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('receiveMessage', (chatMessage: any) => {
        observer.next(chatMessage);
      });
    });
  }

  joinRoom(room: string) {
    this.socket?.emit('joinRoom', room);
  }

  getAllUsers(): any {
    return new Observable(observer => {
      this.socket?.on('allUsers', (users: any) => {
        observer.next(users);
      });
    });
  }
}

