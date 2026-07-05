import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginModel } from '../../models/auth/login.model';
import { RegisterModel } from '../../models/auth/register.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/auth';

  login(credentials: LoginModel): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          if (response.usuario?.rol) {
            localStorage.setItem('role', response.usuario.rol);
          }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  isAdmin(): boolean {
    // IMPORTANTE: Aseguramos que lea el valor actual del localStorage
    return localStorage.getItem('role') === 'ADMINISTRADOR';
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}