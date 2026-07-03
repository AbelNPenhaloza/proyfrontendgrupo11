import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TurnoService } from '../../../../services/turno.service';

Chart.register(...registerables);

/**
 * Gráfico de tipo doughnut que muestra la distribución de turnos por estado.
 * Utiliza Chart.js para renderizar un gráfico circular interactivo.
 * Estados: Pendiente (amarillo), Confirmado (azul), Atendido (verde), Cancelado (rojo).
 */
@Component({
  selector: 'app-turnos-por-estado',
  standalone: true,
  imports: [],
  template: `<div class="chart-wrapper"><canvas #chartCanvas></canvas></div>`,
  styles: [`.chart-wrapper { position: relative; height: 280px; }`]
})
export class TurnosPorEstadoComponent implements AfterViewInit {
  /** Referencia al elemento canvas para Chart.js */
  @ViewChild('chartCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private turnoService: TurnoService) {}

  /** Carga los datos de turnos y renderiza el gráfico doughnut */
  ngAfterViewInit() {
    this.turnoService.getTurnos().subscribe((turnos: any[]) => {
      const conteo = { PENDIENTE: 0, CONFIRMADO: 0, ATENDIDO: 0, CANCELADO: 0 };
      turnos.forEach((t: any) => conteo[t.estado as keyof typeof conteo]++);

      new Chart(this.canvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Pendiente', 'Confirmado', 'Atendido', 'Cancelado'],
          datasets: [{
            data: [conteo.PENDIENTE, conteo.CONFIRMADO, conteo.ATENDIDO, conteo.CANCELADO],
            backgroundColor: ['#ffc107', '#0d6efd', '#198754', '#dc3545'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } }
          }
        }
      });
    });
  }
}
