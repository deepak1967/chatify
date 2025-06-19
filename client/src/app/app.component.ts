import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatify';

  // @HostListener('window:beforeunload', ['$event'])
  // clearLocalStorage(event: Event) {    
  //   localStorage.removeItem('chatify_user');
  // }
}
