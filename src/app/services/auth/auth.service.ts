import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginModel } from '../../models/auth/login.model';
import { RegisterModel } from '../../models/auth/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/auth'; // Asegúrate de que coincida con tu backend

  // Almacenar token en localStorage
  login(credentials: LoginModel): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }

  register(userData: RegisterModel): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  // Verifica si el usuario tiene token (usado por el auth.guard)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}