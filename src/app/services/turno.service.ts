import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Turno } from '../models/turno.model';
import { environment } from '../../environments/environment';

/**
 * Servicio para la gestión de turnos de la barbería conectado al backend.
 */
@Injectable({ providedIn: 'root' })
export class TurnoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}/turnos`;

  /**
   * Obtiene todos los turnos registrados desde el backend y mapea las asociaciones.
   * @returns Observable con array completo de turnos
   */
  getTurnos(): Observable<Turno[]> {
    return this.http.get<{ total: number; turnos: any[] }>(this.apiUrl).pipe(
      map(res => (res.turnos || []).map(t => ({
        turno_id: t.turno_id,
        fecha: t.fecha,
        hora_inicio: t.hora_inicio,
        hora_fin: t.hora_fin,
        estado: t.estado,
        cliente_id: t.cliente_id,
        barbero_id: t.barbero_id,
        servicio_id: t.servicio_id,
        notas: t.notas,
        nombreCliente: t.Cliente ? `${t.Cliente.nombre} ${t.Cliente.apellido}` : 'Sin nombre',
        nombreBarbero: t.Barbero ? t.Barbero.nombre_completo : 'Sin barbero',
        nombreServicio: t.Servicio ? t.Servicio.nombre : 'Sin servicio',
        precioServicio: t.Servicio ? Number(t.Servicio.precio) : 0
      })))
    );
  }

  /**
   * Filtra turnos por fecha específica.
   * @param fecha - Fecha en formato YYYY-MM-DD
   * @returns Observable con array de turnos de esa fecha
   */
  getTurnosPorFecha(fecha: string): Observable<Turno[]> {
    return this.getTurnos().pipe(
      map(turnos => turnos.filter(t => t.fecha === fecha))
    );
  }

  /**
   * Filtra turnos asignados a un barbero específico.
   * @param barberoId - UUID del barbero
   * @returns Observable con array de turnos del barbero
   */
  getTurnosPorBarbero(barberoId: string): Observable<Turno[]> {
    return this.getTurnos().pipe(
      map(turnos => turnos.filter(t => t.barbero_id === barberoId))
    );
  }

  /**
   * Filtra turnos por estado (PENDIENTE, CONFIRMADO, ATENDIDO, CANCELADO).
   * @param estado - Estado del turno a filtrar
   * @returns Observable con array de turnos con ese estado
   */
  getTurnosPorEstado(estado: string): Observable<Turno[]> {
    return this.getTurnos().pipe(
      map(turnos => turnos.filter(t => t.estado === estado))
    );
  }

  /**
   * Obtiene los turnos del día actual.
   * Compara la fecha de cada turno con la fecha del sistema.
   * @returns Observable con array de turnos de hoy
   */
  getTurnosHoy(): Observable<Turno[]> {
    const hoy = new Date().toISOString().split('T')[0];
    return this.getTurnos().pipe(
      map(turnos => turnos.filter(t => t.fecha === hoy))
    );
  }

  /**
   * Elimina un turno por su ID.
   * @param id - UUID del turno
   * @returns Observable con la respuesta del servidor
   */
  deleteTurno(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
