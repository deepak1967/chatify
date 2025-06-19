import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  generatedRoomId: string = '';
  username: string = '';
  roomId: string = '';

  constructor(private router: Router){}

  generateRoomId(): void {
    this.generatedRoomId = Math.random().toString(36).substring(2, 10);
    this.roomId = this.generatedRoomId;
  }

  copyRoomId(): void {
    if (this.generatedRoomId) {
      navigator.clipboard.writeText(this.generatedRoomId).then(() => {
      });
    }
  }

  joinRoom(): void {
    if (this.username && this.roomId) {
      console.log('Joining room:', this.roomId, 'as', this.username);
      this.router.navigate([`chat/${this.roomId}`]);
      localStorage.setItem("chatify_user", this.username);
    }
  }

}
