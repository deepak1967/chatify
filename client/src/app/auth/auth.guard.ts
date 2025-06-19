import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('chatify_user');

  if (isLoggedIn) {
    return true;
  } else {
    return router.navigate([''])
  }
};
