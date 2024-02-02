import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const isLoggedInGuard = () => {
  const auth = inject(AuthService);

  return auth.userIsLoggedIn();
};
