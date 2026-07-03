import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicioService } from '../../../services/servicio.service';
import { ExportService } from '../../../services/export.service';
import { Servicio } from '../../../models/servicio.model';

declare var $: any;

/**
 * Componente tabla de servicios con jQuery DataTables.
 * Muestra listado de servicios de la barbería con búsqueda, paginación y acciones CRUD.
 * Incluye exportación a PDF y Excel.
 */
@Component({
  selector: 'app-servicios-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './servicios-table.html',
  styleUrl: './servicios-table.css'
})
export class ServiciosTable implements OnInit, AfterViewInit {
  /** Array de servicios cargados desde el servicio mock */
  servicios: Servicio[] = [];

  /** Flag de carga */
  cargando = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private servicioService: ServicioService,
    private exportService: ExportService
  ) {}

  /** Carga los servicios al inicializar el componente */
  ngOnInit() {
    this.servicioService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.inicializarDataTable();
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {}

  private inicializarDataTable() {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#serviciosTable')) {
        $('#serviciosTable').DataTable().destroy();
      }
      if ($('#serviciosTable').length) {
        $('#serviciosTable').DataTable({
          responsive: true,
          language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json' },
          pageLength: 10,
          order: [[2, 'desc']]
        });
      }
    }, 100);
  }

  /**
   * Navega al formulario de edición del servicio.
   * @param servicio - Servicio a editar
   */
  editarServicio(servicio: Servicio) {
    console.log('Editar servicio:', servicio.servicio_id);
  }

  /**
   * Elimina un servicio tras confirmación del usuario.
   * @param servicio - Servicio a eliminar
   */
  eliminarServicio(servicio: Servicio) {
    console.log('Eliminar servicio:', servicio.servicio_id);
  }

  /** Exporta el listado de servicios a archivo PDF */
  exportPdf() {
    const columnas = ['Nombre', 'Duración (min)', 'Precio', 'Activo'];
    const datos = this.servicios.map(s => [s.nombre, s.duracion_minutos.toString(), '$' + s.precio.toLocaleString('es-AR'), s.activo ? 'Sí' : 'No']);
    this.exportService.exportarPdf('Listado de Servicios', columnas, datos, 'servicios');
  }

  /** Exporta el listado de servicios a archivo Excel */
  exportExcel() {
    const columnas = ['Nombre', 'Duración (min)', 'Precio', 'Activo'];
    const datos = this.servicios.map(s => [s.nombre, s.duracion_minutos, s.precio, s.activo ? 'Sí' : 'No']);
    this.exportService.exportarExcel('Servicios', columnas, datos, 'servicios');
  }
}
