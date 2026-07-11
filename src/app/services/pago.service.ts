import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pago } from '../models/pago.model';
import { environment } from '../../environments/environment';

/**
 * Servicio para la gestión de pagos de la barbería conectado al backend.
 */
@Injectable({ providedIn: 'root' })
export class PagoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}/pagos`;

  /**
   * Obtiene todos los pagos registrados desde el backend.
   * @returns Observable con array completo de pagos
   */
  getPagos(): Observable<Pago[]> {
    return this.http.get<{ total: number; pagos: any[] }>(this.apiUrl).pipe(
      map(res => (res.pagos || []).map(p => ({
        pago_id: p.pago_id,
        turno_id: p.turno_id,
        monto_total: Number(p.monto_total),
        metodo_pago: p.metodo_pago,
        estado_pago: p.estado_pago,
        fecha_pago: p.createdAt ? p.createdAt.split('T')[0] : '',
        nombreCliente: p.Turno && p.Turno.Cliente ? `${p.Turno.Cliente.nombre} ${p.Turno.Cliente.apellido}` : 'Sin nombre',
        servicio: p.Turno && p.Turno.Servicio ? p.Turno.Servicio.nombre : 'Sin servicio'
      })))
    );
  }

  /**
   * Filtra pagos con estado APROBADO.
   * @returns Observable con array de pagos aprobados
   */
  getPagosAprobados(): Observable<Pago[]> {
    return this.getPagos().pipe(
      map(pagos => pagos.filter(p => p.estado_pago === 'APROBADO'))
    );
  }

  /**
   * Calcula el total de ingresos del mes actual.
   * Suma los montos de pagos aprobados del mes en curso.
   * @returns Observable con el total de ingresos del mes
   */
  getIngresosPorMes(): Observable<number> {
    const mesActual = new Date().toISOString().slice(0, 7);
    return this.getPagosAprobados().pipe(
      map(pagos => pagos
        .filter(p => p.fecha_pago?.startsWith(mesActual))
        .reduce((sum, p) => sum + p.monto_total, 0)
      )
    );
  }

  /**
   * Agrupa ingresos por día y los ordena cronológicamente.
   * Solo incluye pagos aprobados con fecha.
   * @returns Observable con array de objetos { fecha, total }
   */
  getIngresosPorDia(): Observable<{ fecha: string; total: number }[]> {
    return this.getPagosAprobados().pipe(
      map(pagos => {
        const ingresosMap = new Map<string, number>();
        pagos.filter(p => p.fecha_pago).forEach(p => {
          const actual = ingresosMap.get(p.fecha_pago!) || 0;
          ingresosMap.set(p.fecha_pago!, actual + p.monto_total);
        });
        return Array.from(ingresosMap.entries())
          .map(([fecha, total]) => ({ fecha, total }))
          .sort((a, b) => a.fecha.localeCompare(b.fecha));
      })
    );
  }
  /**
   * Envía a validar un pago exitoso de MercadoPago
   */
  confirmarPagoMp(datosPago: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar`, datosPago);
  }
}
