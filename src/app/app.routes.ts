import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; // Importas tu guardia

export const routes: Routes = [
  // Rutas públicas
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(m => m.Login) 
  },
  { 
    path: 'formulario', 
    loadComponent: () => import('./components/formulario-inscripcion/formulario-inscripcion').then(m => m.FormularioInscripcion) 
  },
  
  // Rutas protegidas (Solo usuarios logueados pueden ver esto)
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [authGuard] 
  },
  
  // Redirección por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];