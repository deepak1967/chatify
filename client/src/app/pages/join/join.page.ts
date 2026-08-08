import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-join',
  templateUrl: './join.page.html',
  styleUrls: ['./join.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class JoinPage implements OnInit {

  generatedRoomId: string = '';
  username: string = '';
  roomId: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  generateRoomId(): void {
    this.generatedRoomId = Math.random().toString(36).substring(2, 10);
    this.roomId = this.generatedRoomId;
  }

  copyRoomId(): void {
    if (!this.generatedRoomId) return;
    if (navigator && 'clipboard' in navigator) {
      navigator.clipboard.writeText(this.generatedRoomId).catch(() => {});
    }
  }

  joinRoom(): void {
    if (this.username && this.roomId) {
      localStorage.setItem('chatify_user', this.username);
      // navigate to chat with room id as path param
      this.router.navigate([`/chat/${this.roomId}`]);
    }
  }

}
