import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { PagoService } from '../../../services/pago.service';
import { ExportService } from '../../../services/export.service';
import { Pago } from '../../../models/pago.model';

declare var $: any;

/**
 * Componente tabla de pagos con jQuery DataTables.
 * Vista de solo lectura (sin acciones CRUD).
 * Muestra listado de pagos con búsqueda, paginación y exportación.
 */
@Component({
  selector: 'app-pagos-table',
  standalone: true,
  imports: [],
  templateUrl: './pagos-table.html',
  styleUrl: './pagos-table.css'
})
export class PagosTable implements OnInit, AfterViewInit {
  /** Array de pagos cargados desde el servicio mock */
  pagos: Pago[] = [];

  /** Flag de carga */
  cargando = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private pagoService: PagoService,
    private exportService: ExportService
  ) {}

  /** Carga los pagos al inicializar el componente */
  ngOnInit() {
    this.pagoService.getPagos().subscribe({
      next: (data) => {
        this.pagos = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.inicializarDataTable();
      },
      error: (err) => {
        console.error('Error al cargar pagos:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {}

  private inicializarDataTable() {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#pagosTable')) {
        $('#pagosTable').DataTable().destroy();
      }
      if ($('#pagosTable').length) {
        $('#pagosTable').DataTable({
          responsive: true,
          language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json' },
          pageLength: 10,
          order: [[4, 'desc']]
        });
      }
    }, 100);
  }

  /**
   * Retorna la clase CSS del badge según el método de pago.
   * @param metodo - Método de pago (EFECTIVO, TARJETA, TRANSFERENCIA, QR)
   * @returns Clase CSS de Bootstrap para el badge
   */
  getBadgeMetodo(metodo: string): string {
    const classes: Record<string, string> = {
      'EFECTIVO': 'badge bg-success', 'TARJETA': 'badge bg-primary',
      'TRANSFERENCIA': 'badge bg-info', 'QR': 'badge bg-warning text-dark'
    };
    return classes[metodo] || 'badge bg-secondary';
  }

  /**
   * Retorna la clase CSS del badge según el estado del pago.
   * @param estado - Estado del pago (APROBADO, PENDIENTE, RECHAZADO, etc.)
   * @returns Clase CSS de Bootstrap para el badge
   */
  getBadgeEstado(estado: string): string {
    const classes: Record<string, string> = {
      'APROBADO': 'badge bg-success', 'PENDIENTE': 'badge bg-warning text-dark',
      'RECHAZADO': 'badge bg-danger', 'CANCELADO': 'badge bg-secondary', 'REEMBOLSADO': 'badge bg-info'
    };
    return classes[estado] || 'badge bg-secondary';
  }

  /** Exporta el listado de pagos a archivo PDF */
  exportPdf() {
    const columnas = ['Cliente', 'Servicio', 'Monto', 'Método', 'Estado', 'Fecha'];
    const datos = this.pagos.map(p => [p.nombreCliente, p.servicio, '$' + p.monto_total.toLocaleString('es-AR'), p.metodo_pago, p.estado_pago, p.fecha_pago || '-']);
    this.exportService.exportarPdf('Listado de Pagos', columnas, datos, 'pagos');
  }

  /** Exporta el listado de pagos a archivo Excel */
  exportExcel() {
    const columnas = ['Cliente', 'Servicio', 'Monto', 'Método', 'Estado', 'Fecha'];
    const datos = this.pagos.map(p => [p.nombreCliente, p.servicio, p.monto_total, p.metodo_pago, p.estado_pago, p.fecha_pago || '-']);
    this.exportService.exportarExcel('Pagos', columnas, datos, 'pagos');
  }
}
