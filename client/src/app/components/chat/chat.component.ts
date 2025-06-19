import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  username: any;
  message = '';
  messages: { sender: string, content: string }[] = [];
  socketId: any;
  roomId: any;
  participants: any[] = [];


  constructor(private socketService: SocketService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.roomId = params.roomId;
      if (this.roomId) {
        setTimeout(() => {
          this.joinRoom();
        }, 1000);
      }
      this.username = localStorage.getItem("chatify_user");
    });
  }

  ngOnInit(): void {
    this.socketService.socketIdSubject.subscribe((socketId: any) => {
      this.socketId = socketId;
    })

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
    if (!this.roomId) {
      alert("You must join a room to start chatting.");
      return;
    }
    if (this.message.trim()) {
      const chatMessage = {
        sender: this.socketId,
        content: this.message
      };
      this.socketService.sendMessage(chatMessage, this.roomId);
      this.messages.push(chatMessage); // Display own message
      this.message = '';
    }
  }

  joinRoom() {
    if (this.roomId.trim()) {
      this.socketService.joinRoom(this.roomId);
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
