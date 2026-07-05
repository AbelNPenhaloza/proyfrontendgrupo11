import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginModel } from '../../models/auth/login.model';
import { RegisterModel } from '../../models/auth/register.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/auth';

  // Estado reactivo con signals para que el template se actualice automáticamente
  private readonly _token = signal<string | null>(localStorage.getItem('auth_token'));
  private readonly _role = signal<string | null>(localStorage.getItem('role'));

  // Computed signals derivados del estado de autenticación
  readonly isAuthenticated = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._role() === 'ADMINISTRADOR');

  login(credentials: LoginModel): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this._token.set(response.token);
          if (response.usuario?.rol) {
            localStorage.setItem('role', response.usuario.rol);
            this._role.set(response.usuario.rol);
          }
        }
      })
    );
  }

  register(userData: RegisterModel): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    this._token.set(null);
    this._role.set(null);
  }

  getToken(): string | null {
    return this._token();
  }

  getUsuarioId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.usuario_id || payload.id || null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}