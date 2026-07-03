import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PagoService } from '../../../../services/pago.service';

Chart.register(...registerables);

/**
 * Gráfico de tipo barra vertical que muestra ingresos por día.
 * Muestra los últimos 7 días con ingresos aprobados.
 * Utiliza Chart.js para renderizar un gráfico de barras interactivo.
 */
@Component({
  selector: 'app-ingresos-por-dia',
  standalone: true,
  imports: [],
  template: `<div class="chart-wrapper"><canvas #chartCanvas></canvas></div>`,
  styles: [`.chart-wrapper { position: relative; height: 280px; }`]
})
export class IngresosPorDiaComponent implements AfterViewInit {
  /** Referencia al elemento canvas para Chart.js */
  @ViewChild('chartCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private pagoService: PagoService) {}

  /** Carga los datos de ingresos y renderiza el gráfico de barras */
  ngAfterViewInit() {
    this.pagoService.getIngresosPorDia().subscribe((data: any[]) => {
      const ultimos7 = data.slice(-7);
      const labels = ultimos7.map((d: any) => {
        const fecha = new Date(d.fecha + 'T12:00:00');
        return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      });

      new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Ingresos ($)',
            data: ultimos7.map((d: any) => d.total),
            backgroundColor: 'rgba(13, 110, 253, 0.8)',
            borderColor: '#0d6efd',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: string | number) => '$' + Number(value).toLocaleString('es-AR') } } }
        }
      });
    });
  }
}
