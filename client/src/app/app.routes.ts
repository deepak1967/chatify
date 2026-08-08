import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'join',
    pathMatch: 'full',
  },
  {
    path: 'join',
    loadComponent: () =>
      import('./pages/join/join.page').then((m) => m.JoinPage),
  },
  {
    path: 'chat/:id',
    loadComponent: () =>
      import('./pages/chat/chat.page').then((m) => m.ChatPage),
  },
];
