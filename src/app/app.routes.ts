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
  // NUEVA RUTA: Captura el callback de Google Login
  {
    path: 'auth/google',
    loadComponent: () => import('./components/google-callback/google-callback').then(m => m.GoogleCallback)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },

  // Rutas protegidas (Solo usuarios logueados pueden ver esto)
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'turnos',
        loadComponent: () => import('./components/admin/turnos-table/turnos-table').then(m => m.TurnosTable)
      },
      {
        path: 'turnos/crear',
        loadComponent: () => import('./components/admin/turno-form/turno-form').then(m => m.TurnoForm)
      },
      {
        path: 'turnos/editar/:id',
        loadComponent: () => import('./components/admin/turno-form/turno-form').then(m => m.TurnoForm)
      },
      {
        path: 'pagos',
        loadComponent: () => import('./components/admin/pagos-table/pagos-table').then(m => m.PagosTable)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/admin/usuarios-table/usuarios-table').then(m => m.UsuariosTable)
      },
      {
        path: 'usuarios/crear',
        loadComponent: () => import('./components/admin/usuario-form/usuario-form').then(m => m.UsuarioForm)
      },
      {
        path: 'usuarios/editar/:id',
        loadComponent: () => import('./components/admin/usuario-form/usuario-form').then(m => m.UsuarioForm)
      },
      {
        path: 'barberos',
        loadComponent: () => import('./components/admin/barberos-table/barberos-table').then(m => m.BarberosTable)
      },
      {
        path: 'barberos/crear',
        loadComponent: () => import('./components/admin/barbero-form/barbero-form').then(m => m.BarberoForm)
      },
      {
        path: 'barberos/editar/:id',
        loadComponent: () => import('./components/admin/barbero-form/barbero-form').then(m => m.BarberoForm)
      },
      {
        path: 'servicios',
        loadComponent: () => import('./components/admin/servicios-table/servicios-table').then(m => m.ServiciosTable)
      },
      {
        path: 'servicios/crear',
        loadComponent: () => import('./components/admin/servicio-form/servicio-form').then(m => m.ServicioForm)
      },
      {
        path: 'servicios/editar/:id',
        loadComponent: () => import('./components/admin/servicio-form/servicio-form').then(m => m.ServicioForm)
      },

      {
        path: 'perfil',
        canActivate: [authGuard],
        loadComponent: () => import('./components/perfil/perfil').then(m => m.Perfil)
      },

    ]
  },

  // Redirección por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];