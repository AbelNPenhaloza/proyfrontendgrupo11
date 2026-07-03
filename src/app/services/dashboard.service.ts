import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TurnoService } from './turno.service';
import { PagoService } from './pago.service';
import { UsuarioService } from './usuario.service';
import { BarberoService } from './barbero.service';

export interface KPI {
  titulo: string;
  valor: string | number;
  icono: string;
  color: string;
}

/**
 * Servicio que centraliza la obtención de KPIs del dashboard admin.
 * Agrega datos de múltiples servicios para mostrar indicadores clave.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private turnoService = inject(TurnoService);
  private pagoService = inject(PagoService);
  private usuarioService = inject(UsuarioService);
  private barberoService = inject(BarberoService);

  /**
   * Obtiene los KPIs principales del dashboard llamando a las APIs correspondientes.
   * @returns Observable con el listado formateado de KPIs
   */
  getKPIs(): Observable<KPI[]> {
    return forkJoin({
      turnosHoy: this.turnoService.getTurnosHoy(),
      ingresosMes: this.pagoService.getIngresosPorMes(),
      totalUsuarios: this.usuarioService.getTotalUsuarios(),
      barberosActivos: this.barberoService.getBarberosActivos()
    }).pipe(
      map(res => [
        { titulo: 'Turnos Hoy', valor: res.turnosHoy.length, icono: 'bi-calendar-check', color: '#0d6efd' },
        { titulo: 'Ingresos del Mes', valor: `$${res.ingresosMes.toLocaleString()}`, icono: 'bi-cash', color: '#198754' },
        { titulo: 'Total Usuarios', valor: res.totalUsuarios, icono: 'bi-people', color: '#6f42c1' },
        { titulo: 'Barberos Activos', valor: res.barberosActivos.length, icono: 'bi-scissors', color: '#fd7e14' }
      ])
    );
  }
}
