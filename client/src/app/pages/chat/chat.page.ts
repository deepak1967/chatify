import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatPage implements OnInit {
  @ViewChild('chatEnd', { read: ElementRef }) chatEnd?: ElementRef;

  username: any;
  message = '';
  messages: { username:string, sender: string, content: string }[] = [];
  socketId: any;
  roomId: any;
  participants: any[] = [];
  isConnected = false;

  selectedTab: 'join' | 'create' = 'join';

  constructor(private socketService: SocketService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.roomId = params.id || params.roomId;
      this.username = localStorage.getItem('chatify_user');
    });
  }

  ngOnInit(): void {
    this.socketService.connected$.subscribe((connected) => {
      this.isConnected = connected;
      if (connected && this.roomId) {
        this.joinRoom();
      }
    });

    this.socketService.socketIdSubject.subscribe((socketId: any) => {
      this.socketId = socketId;
    });

    this.socketService.joinRoomObservable$.subscribe((newParticipant: any) => {
      this.participants.push(newParticipant);
    });

    this.socketService.message$.subscribe((chatMessage: any) => {
      this.messages.push(chatMessage);
      this.scrollToBottom();
    });

    this.connectSocket();
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  connectSocket() {
    this.socketService.connectSocket();
  }

  disConnectSocket() {
    this.socketService.disconnectSocket();
  }

  sendMessage(): void {
    if (!this.roomId) {
      alert('You must join a room to start chatting.');
      return;
    }

    if (!this.isConnected) {
      alert('Connecting to the server. Please wait a moment.');
      return;
    }

    if (this.message.trim()) {
      const chatMessage = {
        username: this.username,
        sender: this.socketId,
        content: this.message
      };
      this.socketService.sendMessage(chatMessage, this.roomId);
      this.messages.push(chatMessage); // Display own message
      this.message = '';
    }
  }

  joinRoom() {
    if (this.roomId && this.roomId.trim()) {
      this.socketService.joinRoom(this.roomId);
    }
  }

  handleBeforeUnload(): void {
    const participants = JSON.parse(localStorage.getItem('participants') || '[]');
    const index = participants.findIndex((p: any) => p.id === this.socketId);
    if (index !== -1) {
      participants.splice(index, 1);
    }
  }

  createRoom() {
    // logic to create room
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.chatEnd?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 0);
  }

}
