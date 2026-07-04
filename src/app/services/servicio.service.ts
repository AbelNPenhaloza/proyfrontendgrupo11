import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Servicio } from '../models/servicio.model';
import { environment } from '../../environments/environment';

/**
 * Servicio para la gestión de servicios de la barbería conectado al backend.
 */
@Injectable({ providedIn: 'root' })
export class ServicioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}/servicios`;

  /**
   * Obtiene todos los servicios disponibles.
   * @returns Observable con array completo de servicios desde el backend
   */
  getServicios(): Observable<Servicio[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(servicios => servicios.map(s => ({
        servicio_id: s.servicio_id,
        nombre: s.nombre,
        descripcion: s.descripcion,
        duracion_minutos: s.duracion_minutos,
        precio: Number(s.precio),
        activo: s.activo
      })))
    );
  }

  /**
   * Filtra servicios con estado activo.
   * @returns Observable con array de servicios activos
   */
  getServiciosActivos(): Observable<Servicio[]> {
    return this.getServicios().pipe(
      map(servicios => servicios.filter(s => s.activo))
    );
  }

  /**
   * Elimina un servicio por su ID.
   * @param id - UUID del servicio
   * @returns Observable con la respuesta del servidor
   */
  deleteServicio(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo servicio.
   */
  createServicio(servicio: any): Observable<any> {
    return this.http.post(this.apiUrl, servicio);
  }

  /**
   * Actualiza un servicio existente.
   */
  updateServicio(id: string, servicio: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, servicio);
  }
}
