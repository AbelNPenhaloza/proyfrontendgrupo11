import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginModel } from '../../models/auth/login.model';
import { RegisterModel } from '../../models/auth/register.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:3000/api/auth';

  login(credentials: LoginModel): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          // Guardamos el rol si viene en la respuesta del backend
          if (response.usuario?.rol) {
            localStorage.setItem('role', response.usuario.rol);
          }
        }
      })
    );
  }

  register(userData: RegisterModel): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  // === PARA LA AUDITORÍA ===
  logout(): void {
    const token = this.getToken();
    if (token) {
      // Avisamos al backend para que audite el LOGOUT
      this.http.post(`${this.API_URL}/logout`, {}).subscribe({
        next: () => this.limpiarSesion(),
        error: () => this.limpiarSesion() // Si falla, borramos la sesión igual por seguridad
      });
    } else {
      this.limpiarSesion();
    }
  }

  // Método auxiliar privado para no repetir código
  private limpiarSesion(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMINISTRADOR';
  }
  
  isBarbero(): boolean {
    return localStorage.getItem('role') === 'BARBERO';
  }

  isBarberoLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token') && localStorage.getItem('role') === 'BARBERO';
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  getUsuarioId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.usuario_id || null;
  }
}