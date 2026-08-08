import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChatPage implements OnInit {
  @ViewChild('chatContainer', { read: ElementRef }) chatContainer?: ElementRef;

  username: any;
  message = '';
  messages: { username: string; sender: string; content: string }[] = [];
  socketId: any;
  roomId: any;
  participants: any[] = [];
  users: any[] = [];
  isConnected = false;

  get participantNames(): string {
    return this.participants
      .map((participant) => participant.username)
      .filter(Boolean)
      .join(', ');
  }

  selectedTab: 'join' | 'create' = 'join';

  constructor(
    private socketService: SocketService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
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

    this.socketService.joinRoomObservable$.subscribe((response: any) => {
      if (response?.participants) {
        this.participants = response.participants;
      }
    });

    this.socketService.userJoined$.subscribe((participant: any) => {
      this.participants.push(participant);
      this.messages.push({
        username: 'System',
        sender: 'system',
        content: `${participant.username} has joined the room.`,
      });
      this.scrollToBottom();
    });

    this.socketService.userLeft$.subscribe((participant: any) => {
      this.participants = this.participants.filter(
        (p) => p.id !== participant.id,
      );
      this.messages.push({
        username: 'System',
        sender: 'system',
        content: `${participant.username} has left the room.`,
      });
      this.scrollToBottom();
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

  leaveRoom() {
    this.router.navigate(['join']);
    sessionStorage.clear();
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
        content: this.message,
      };
      this.socketService.sendMessage(chatMessage, this.roomId);
      this.messages.push(chatMessage); // Display own message
      this.message = '';
      this.scrollToBottom();
    }
  }

  joinRoom() {
    if (this.roomId && this.roomId.trim()) {
      this.socketService.joinRoom(this.roomId, this.username || 'Unknown');
    }
  }

  handleBeforeUnload(): void {
    const participants = JSON.parse(
      localStorage.getItem('participants') || '[]',
    );
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
      const container = this.chatContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }
}
