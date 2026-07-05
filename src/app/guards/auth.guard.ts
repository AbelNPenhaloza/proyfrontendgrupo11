import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Si intenta entrar a una ruta de admin sin serlo, lo mandamos al home del cliente
  if (state.url.includes('/admin') && !authService.isAdmin()) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};