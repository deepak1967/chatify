import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  username: string = ''
  message = '';
  messages: { sender: string, content: string }[] = [];
  socketId: any;
  room: any;


  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.socketIdObservable$.subscribe(socketId => {
      this.socketId = socketId;
    });
    this.connectSocket();
  }

  connectSocket() {
    this.socketService.connectSocket();
    this.receiveMessage();
  }

  disConnectSocket() {
    this.socketService.disconnectSocket();
  }

  receiveMessage(): void {
    this.socketService.receiveMessage().subscribe((chatMessage: any) => {
      this.messages.push(chatMessage);
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      const chatMessage = {
        sender: this.socketId,
        content: this.message
      };
      this.socketService.sendMessage(chatMessage, this.room);
      this.messages.push(chatMessage); // Display own message
      this.message = '';
    }
  }

  joinRoom() {
    if (this.room.trim()) {
      this.socketService.joinRoom(this.room, );
      // this.room = '';
    }
  }

}
