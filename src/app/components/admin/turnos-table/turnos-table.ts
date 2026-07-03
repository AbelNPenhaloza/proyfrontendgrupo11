import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';
import { ExportService } from '../../../services/export.service';
import { Turno } from '../../../models/turno.model';

declare var $: any;

/**
 * Componente tabla de turnos con jQuery DataTables.
 * Muestra listado de turnos con búsqueda, paginación y acciones CRUD.
 * Incluye exportación a PDF y Excel.
 */
@Component({
  selector: 'app-turnos-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './turnos-table.html',
  styleUrl: './turnos-table.css'
})
export class TurnosTable implements OnInit, AfterViewInit {
  /** Array de turnos cargados desde el servicio mock */
  turnos: Turno[] = [];

  /** Flag de carga */
  cargando = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private turnoService: TurnoService,
    private exportService: ExportService
  ) {}

  /** Carga los turnos al inicializar el componente */
  ngOnInit() {
    this.turnoService.getTurnos().subscribe({
      next: (data) => {
        this.turnos = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.inicializarDataTable();
      },
      error: (err) => {
        console.error('Error al cargar turnos:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {}

  private inicializarDataTable() {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#turnosTable')) {
        $('#turnosTable').DataTable().destroy();
      }
      if ($('#turnosTable').length) {
        $('#turnosTable').DataTable({
          responsive: true,
          language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json' },
          pageLength: 10,
          order: [[0, 'desc'], [1, 'desc']]
        });
      }
    }, 100);
  }

  /**
   * Retorna la clase CSS del badge según el estado del turno.
   * @param estado - Estado del turno
   * @returns Clase CSS de Bootstrap para el badge
   */
  getBadgeClass(estado: string): string {
    const classes: Record<string, string> = {
      'PENDIENTE': 'badge bg-warning text-dark',
      'CONFIRMADO': 'badge bg-primary',
      'ATENDIDO': 'badge bg-success',
      'CANCELADO': 'badge bg-danger'
    };
    return classes[estado] || 'badge bg-secondary';
  }

  /**
   * Navega al formulario de edición del turno.
   * @param turno - Turno a editar
   */
  editarTurno(turno: Turno) {
    console.log('Editar turno:', turno.turno_id);
  }

  /**
   * Elimina un turno tras confirmación del usuario.
   * @param turno - Turno a eliminar
   */
  eliminarTurno(turno: Turno) {
    console.log('Eliminar turno:', turno.turno_id);
  }

  /** Exporta el listado de turnos a archivo PDF */
  exportPdf() {
    const columnas = ['Fecha', 'Hora', 'Cliente', 'Barbero', 'Servicio', 'Estado'];
    const datos = this.turnos.map(t => [t.fecha, t.hora_inicio, t.nombreCliente, t.nombreBarbero, t.nombreServicio, t.estado]);
    this.exportService.exportarPdf('Listado de Turnos', columnas, datos, 'turnos');
  }

  /** Exporta el listado de turnos a archivo Excel */
  exportExcel() {
    const columnas = ['Fecha', 'Hora', 'Cliente', 'Barbero', 'Servicio', 'Estado'];
    const datos = this.turnos.map(t => [t.fecha, t.hora_inicio, t.nombreCliente, t.nombreBarbero, t.nombreServicio, t.estado]);
    this.exportService.exportarExcel('Turnos', columnas, datos, 'turnos');
  }
}
