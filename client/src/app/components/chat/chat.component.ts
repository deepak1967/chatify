import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
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


  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.socketIdObservable$.subscribe(socketId => {
      this.socketId = socketId;
    });
    this.disConnectSocket();
  }

  connectSocket() {
    this.socketService.connectSocket();
  }

  disConnectSocket() {
    this.socketService.disconnectSocket();
  }

  receiveMessage(): void {
    this.socketService.receiveMessage().subscribe((chatMessage: any) => {
      console.log('Received:', this.messages);
      this.messages.push(chatMessage);

    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      const chatMessage = {
        sender: this.socketId,
        content: this.message
      };
      this.socketService.sendMessage(chatMessage);
      this.messages.push(chatMessage); // Display own message
      this.receiveMessage();
      this.message = '';
    }
  }

}
