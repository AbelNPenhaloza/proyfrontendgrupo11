import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar si la ruta es de admin y el usuario no tiene permisos
  if (state.url.includes('/admin') && !authService.isAdmin()) {
    router.navigate(['/']); // Redirigir al inicio o dashboard cliente
    return false;
  }

  return true;
};