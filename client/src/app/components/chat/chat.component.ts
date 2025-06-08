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
  messages: string[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.connectSocket();
    this.getAllUser();

  }

  connectSocket() {
    this.socketService.connectSocket();
  }

  disConnectSocket() {
    this.socketService.disconnectSocket();
  }

  joinUser() {
    const name = this.username;
    this.socketService.joinUser(name);
  }

  getAllUser() {
    this.socketService.getAllUsers().subscribe((users: any) => {
      console.log(users);
    })
  }

  send(): void {
    if (this.message.trim()) {
      this.socketService.sendMessage(this.message);
      this.message = '';
    }
  }

}
