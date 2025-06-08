import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private socketUrl: string = environment.socketUrl;


  constructor() {
    this.socket = io(this.socketUrl);

    console.log(environment);
    
  }

  sendMessage(msg: string): void {
    this.socket.emit('sendMessage', msg);
  }

  getMessages(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('receiveMessage', (msg: string) => {
        observer.next(msg);
      });
    });
  }
}
