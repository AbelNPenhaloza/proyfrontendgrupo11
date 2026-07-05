import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Si intenta entrar a una ruta de admin sin serlo, lo mandamos al home del cliente
  if (state.url.includes('/admin') && !authService.isAdmin()) {
    router.navigate(['/home']);
  // 2. Si la ruta requiere admin, validamos rol
  if (state.url.includes('/admin') && !authService.isAdmin()) {
    router.navigate(['/']); 
    return false;
  }

  // Si llega aquí, es porque está logueado. 
  // Si la ruta es '/perfil', el guardia lo permite porque pasó el primer IF.
  return true;
};