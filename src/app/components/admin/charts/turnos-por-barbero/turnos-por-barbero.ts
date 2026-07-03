import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BarberoService } from '../../../../services/barbero.service';

Chart.register(...registerables);

/**
 * Gráfico de tipo barra horizontal que muestra turnos por barbero.
 * Ordena de mayor a menor cantidad de turnos.
 * Utiliza Chart.js para renderizar un gráfico de barras horizontales interactivo.
 */
@Component({
  selector: 'app-turnos-por-barbero',
  standalone: true,
  imports: [],
  template: `<div class="chart-wrapper"><canvas #chartCanvas></canvas></div>`,
  styles: [`.chart-wrapper { position: relative; height: 280px; }`]
})
export class TurnosPorBarberoComponent implements AfterViewInit {
  /** Referencia al elemento canvas para Chart.js */
  @ViewChild('chartCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  /** Paleta de colores para las barras de cada barbero */
  private colores = ['#0d6efd', '#198754', '#fd7e14', '#6f42c1', '#20c997'];

  constructor(private barberoService: BarberoService) {}

  /** Carga los datos de turnos por barbero y renderiza el gráfico horizontal */
  ngAfterViewInit() {
    this.barberoService.getTurnosPorBarbero().subscribe((data: any[]) => {
      new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: {
          labels: data.map((d: any) => d.barbero),
          datasets: [{
            label: 'Turnos',
            data: data.map((d: any) => d.cantidad),
            backgroundColor: data.map((_: any, i: number) => this.colores[i % this.colores.length]),
            borderWidth: 0,
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true } }
        }
      });
    });
  }
}
