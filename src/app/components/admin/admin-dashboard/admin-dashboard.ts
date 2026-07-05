import { Component, OnInit, inject } from '@angular/core';
import { TurnosPorEstadoComponent } from '../charts/turnos-por-estado/turnos-por-estado';
import { IngresosPorDiaComponent } from '../charts/ingresos-por-dia/ingresos-por-dia';
import { TurnosPorBarberoComponent } from '../charts/turnos-por-barbero/turnos-por-barbero';
import { DashboardService, KPI } from '../../../services/dashboard.service';

/**
 * Componente principal del panel de administración.
 * Muestra 4 KPIs clave y 3 gráficos interactivos con Chart.js.
 * Diseño mobile-first responsive.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [TurnosPorEstadoComponent, IngresosPorDiaComponent, TurnosPorBarberoComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  kpis: KPI[] = [];

  ngOnInit(): void {
    this.dashboardService.getKPIs().subscribe({
      next: (kpis) => {
        this.kpis = kpis;
      },
      error: (err) => {
        console.error('Error al obtener KPIs:', err);
      }
    });
  }
}
