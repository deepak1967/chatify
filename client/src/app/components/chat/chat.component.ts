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
  participants: any[] = [];
  isdisabled: boolean = false;


  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.socketIdObservable$.subscribe(socketId => {
      this.socketId = socketId;
    });

    this.socketService.joinRoomObservable$.subscribe((newParticipant: any) => {
      // this.participants = JSON.parse(localStorage.getItem('participants') || '[]');
      this.participants.push(newParticipant);
      // localStorage.setItem('participants', JSON.stringify(this.participants));
    });

    this.connectSocket();
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

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
    if (!this.room) {
      alert("You must join a room to start chatting.");
      return;
    }
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
      this.isdisabled = true
      this.socketService.joinRoom(this.room);
    }
  }

  handleBeforeUnload(): void {
    const participants = JSON.parse(localStorage.getItem('participants') || '[]');
    const index = participants.findIndex((p: any) => p.id === this.socketId);
    if (index !== -1) {
      participants.splice(index, 1);
    }
    // localStorage.setItem('participants', JSON.stringify(participants));
  }

  selectedTab: 'join' | 'create' = 'join';

  createRoom() {
    // logic to create room
  }

}
