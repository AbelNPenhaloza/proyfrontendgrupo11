import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

/**
 * Servicio para la gestión de usuarios del sistema conectado al backend.
 * Permite obtener usuarios, filtrar por rol y verificar estado.
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}/usuarios`;

  /**
   * Obtiene todos los usuarios registrados.
   * @returns Observable con array completo de usuarios desde el backend
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /**
   * Filtra usuarios por rol (CLIENTE, BARBERO, ADMINISTRADOR, RECEPCIONISTA).
   * @param rol - Rol a filtrar
   * @returns Observable con array de usuarios con ese rol
   */
  getUsuariosPorRol(rol: string): Observable<Usuario[]> {
    return this.getUsuarios().pipe(
      map(users => users.filter(u => u.rol === rol))
    );
  }

  /**
   * Filtra usuarios con estado activo.
   * @returns Observable con array de usuarios activos
   */
  getUsuariosActivos(): Observable<Usuario[]> {
    return this.getUsuarios().pipe(
      map(users => users.filter(u => u.activo))
    );
  }

  /**
   * Obtiene el total de usuarios registrados.
   * @returns Observable con el conteo total de usuarios
   */
  getTotalUsuarios(): Observable<number> {
    return this.getUsuarios().pipe(
      map(users => users.length)
    );
  }

  /**
   * Elimina un usuario por su ID.
   * @param id - UUID del usuario
   * @returns Observable con la respuesta del servidor
   */
  deleteUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo usuario mediante la ruta de registro.
   */
  createUsuario(usuario: any): Observable<any> {
    const url = `${environment.API_BASE_URL}/auth/register`;
    return this.http.post(url, usuario);
  }

  /**
   * Actualiza un usuario existente.
   */
  updateUsuario(id: string, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  /**
   * Obtiene un usuario por ID.
   */
  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }
  /**
   * Obtiene los datos del perfil propio del usuario autenticado.
   */
  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`);
  }

  /**
   * Actualiza los datos del perfil propio.
   */
  actualizarPerfil(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, data);
  }
}
