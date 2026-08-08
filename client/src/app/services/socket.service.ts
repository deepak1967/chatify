import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;
  private socketUrl: string = (environment as any).socketUrl || 'http://localhost:3000';
  public socketIdSubject = new Subject<string>();
  socketIdObservable$ = this.socketIdSubject.asObservable();

  public connected$ = new BehaviorSubject<boolean>(false);
  private messageSubject = new Subject<any>();
  public message$ = this.messageSubject.asObservable();

  public joinRoomSubject = new Subject<any>();
  joinRoomObservable$ = this.joinRoomSubject.asObservable();
  public userJoinedSubject = new Subject<any>();
  public userLeftSubject = new Subject<any>();
  userJoined$ = this.userJoinedSubject.asObservable();
  userLeft$ = this.userLeftSubject.asObservable();

  private pendingRoom?: string;
  private pendingUsername?: string;
  private isConnected = false;
  private isConnecting = false;

  constructor() { }

  // Manual connection trigger
  connectSocket(): void {
    if (this.socket && this.isConnected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    import('socket.io-client').then(({ io }) => {
      this.socket = io(this.socketUrl, { autoConnect: false });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.isConnecting = false;
        this.connected$.next(true);
        const id: any = this.socket.id;
        this.socketIdSubject.next(id);
        if (this.pendingRoom && this.pendingUsername) {
          this.joinRoom(this.pendingRoom, this.pendingUsername);
          this.pendingRoom = undefined;
          this.pendingUsername = undefined;
        }
      });

      this.socket.on('receiveMessage', (chatMessage: any) => {
        this.messageSubject.next(chatMessage);
      });

      this.socket.on('userJoined', (participant: any) => {
        this.userJoinedSubject.next(participant);
      });

      this.socket.on('userLeft', (participant: any) => {
        this.userLeftSubject.next(participant);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        this.connected$.next(false);
      });

      this.socket.on('connect_error', (err: any) => {
        this.isConnected = false;
        this.isConnecting = false;
        this.connected$.next(false);
        console.error('Socket connection failed', err);
      });

      this.socket.connect();
    }).catch((err) => {
      this.isConnecting = false;
      console.error('Failed to load socket.io-client', err);
    });
  }

  disconnectSocket(): void {
    this.socket?.disconnect();
    this.isConnected = false;
    this.isConnecting = false;
    this.connected$.next(false);
    console.log('socket disconnected');
  }



  sendMessage(chatMessage: { username:string,sender: string, content: string }, room: any): void {
    if (!this.isConnected) {
      console.error('Socket not connected yet');
      return;
    }
    this.socket.emit('sendMessage', chatMessage, room);
  }


  receiveMessage(): Observable<any> {
    return this.message$;
  }

  joinRoom(room: string, username: string) {
    if (!this.isConnected) {
      this.pendingRoom = room;
      this.pendingUsername = username;
      return;
    }
    this.socket.emit('joinRoom', room, username, (message: any) => {
      console.log(message);
      this.joinRoomSubject.next(message);
    });
  }

  getAllUsers(): any {
    return new Observable(observer => {
      this.socket?.on('allUsers', (users: any) => {
        observer.next(users);
      });
    });
  }
}
