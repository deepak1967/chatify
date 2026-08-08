import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-join',
  templateUrl: './join.page.html',
  styleUrls: ['./join.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class JoinPage implements OnInit {

  generatedRoomId: string = '';
  username: string = '';
  roomId: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}


  joinRoom(): void {
    if (this.username && this.roomId) {
      localStorage.setItem('chatify_user', this.username);
      this.router.navigate([`/chat/${this.roomId}`]);
      this.username = ''
      this.roomId = ''
    }
  }

}
