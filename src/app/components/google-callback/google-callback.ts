import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-google-callback',
  imports: [],
  templateUrl: './google-callback.html',
  styleUrl: './google-callback.css',
})
export class GoogleCallback implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    // Capturamos el token de la URL (query params)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (token) {
        // Guardamos el token en localStorage (igual que en tu auth.service normal)
        localStorage.setItem('auth_token', token);
        
        // Decodificamos el JWT para extraer el rol (Lógica sugerida por la cátedra)
        const payload = this.decodeJwtResponse(token);
        if (payload && payload.rol) {
          localStorage.setItem('role', payload.rol);
        }

        // Redirección inteligente usando los métodos que ya tienes en AuthService
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else if (this.authService.isBarbero()) {
          this.router.navigate(['/barbero/dashboard']);
        } else {
          this.router.navigate(['/cliente/turnos']);
        }
      } else {
        // Si no hay token en la URL, devolvemos al usuario al login
        this.router.navigate(['/login']);
      }
    });
  }

  // Método basado en el apunte de la cátedra para decodificar JWT manualmente
  private decodeJwtResponse(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error al decodificar el token', e);
      return null;
    }
  }
}
