import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

 message = '';
  messages: string[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
   
  }

  // createConnection(){
  //   // this.socketService.createConnection();
  //    this.socketService.getMessages().subscribe((msg: string) => {
  //     this.messages.push(msg);
  //   });
  // }

  send(): void {
    if (this.message.trim()) {
      this.socketService.sendMessage(this.message);
      this.message = '';
    }
  }

}
