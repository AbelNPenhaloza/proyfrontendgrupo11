import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Barbero } from '../models/barbero.model';
import { TurnoService } from './turno.service';
import { environment } from '../../environments/environment';

/**
 * Servicio para la gestión de barberos de la barbería conectado al backend.
 */
@Injectable({ providedIn: 'root' })
export class BarberoService {
  private http = inject(HttpClient);
  private turnoService = inject(TurnoService);
  private apiUrl = `${environment.API_BASE_URL}/barberos`;

  /**
   * Obtiene todos los barberos registrados.
   * @returns Observable con array completo de barberos desde el backend
   */
  getBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(this.apiUrl);
  }

  /**
   * Filtra barberos con estado activo.
   * @returns Observable con array de barberos activos
   */
  getBarberosActivos(): Observable<Barbero[]> {
    return this.getBarberos().pipe(
      map(barberos => barberos.filter(b => b.activo))
    );
  }

  /**
   * Cuenta la cantidad de turnos asignados a cada barbero usando datos reales del backend.
   * Ordena de mayor a menor cantidad.
   * @returns Observable con array de objetos { barbero, cantidad }
   */
  getTurnosPorBarbero(): Observable<{ barbero: string; cantidad: number }[]> {
    return this.turnoService.getTurnos().pipe(
      map(turnos => {
        const turnosMap = new Map<string, number>();
        turnos.forEach(t => {
          const nombre = t.nombreBarbero || 'Sin nombre';
          turnosMap.set(nombre, (turnosMap.get(nombre) || 0) + 1);
        });
        return Array.from(turnosMap.entries())
          .map(([barbero, cantidad]) => ({ barbero, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad);
      })
    );
  }

  /**
   * Elimina un barbero por su ID.
   * @param id - UUID del barbero
   * @returns Observable con la respuesta del servidor
   */
  deleteBarbero(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
