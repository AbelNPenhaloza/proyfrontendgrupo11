import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BarberoPanelService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.API_BASE_URL;

  // Obtener turnos del día para el barbero
  getAgenda(barberoId: string, fecha: string): Observable<any> {
    return this.http.get(`${this.API_URL}/turnos?barberoId=${barberoId}&fecha=${fecha}`);
  }

  // Marcar turno como atendido
  marcarAtendido(turnoId: string): Observable<any> {
    return this.http.put(`${this.API_URL}/turnos/${turnoId}/estado`, { estado: 'ATENDIDO' });
  }

  // Obtener disponibilidad del barbero
  getDisponibilidad(barberoId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/barberos/${barberoId}/disponibilidad`);
  }

  // Actualizar disponibilidad
  updateDisponibilidad(barberoId: string, disponibilidad: any[]): Observable<any> {
    return this.http.put(`${this.API_URL}/barberos/${barberoId}/disponibilidad`, { disponibilidad });
  }
}