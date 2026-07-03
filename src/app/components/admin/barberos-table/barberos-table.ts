import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BarberoService } from '../../../services/barbero.service';
import { ExportService } from '../../../services/export.service';
import { Barbero } from '../../../models/barbero.model';

declare var $: any;

/**
 * Componente tabla de barberos con jQuery DataTables.
 * Muestra listado de barberos con búsqueda, paginación y acciones CRUD.
 * Incluye exportación a PDF y Excel.
 */
@Component({
  selector: 'app-barberos-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './barberos-table.html',
  styleUrl: './barberos-table.css'
})
export class BarberosTable implements OnInit, AfterViewInit {
  /** Array de barberos cargados desde el servicio mock */
  barberos: Barbero[] = [];

  /** Flag de carga */
  cargando = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private barberoService: BarberoService,
    private exportService: ExportService
  ) {}

  /** Carga los barberos al inicializar el componente */
  ngOnInit() {
    this.barberoService.getBarberos().subscribe({
      next: (data) => {
        this.barberos = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.inicializarDataTable();
      },
      error: (err) => {
        console.error('Error al cargar barberos:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {}

  private inicializarDataTable() {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#barberosTable')) {
        $('#barberosTable').DataTable().destroy();
      }
      if ($('#barberosTable').length) {
        $('#barberosTable').DataTable({
          responsive: true,
          language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json' },
          pageLength: 10,
          order: [[0, 'asc']]
        });
      }
    }, 100);
  }

  /**
   * Retorna la clase CSS del badge según la especialidad del barbero.
   * @param esp - Especialidad (DEGRADADOS, CLASICO, BARBA, COLORISTA)
   * @returns Clase CSS de Bootstrap para el badge
   */
  getBadgeEspecialidad(esp: string): string {
    const classes: Record<string, string> = {
      'DEGRADADOS': 'badge bg-primary', 'CLASICO': 'badge bg-success',
      'BARBA': 'badge bg-warning text-dark', 'COLORISTA': 'badge bg-info'
    };
    return classes[esp] || 'badge bg-secondary';
  }

  /**
   * Navega al formulario de edición del barbero.
   * @param barbero - Barbero a editar
   */
  editarBarbero(barbero: Barbero) {
    alert(`La pantalla para editar al barbero ${barbero.nombre_completo} está en desarrollo.`);
  }

  /**
   * Elimina un barbero tras confirmación del usuario.
   * @param barbero - Barbero a eliminar
   */
  eliminarBarbero(barbero: Barbero) {
    if (confirm(`¿Estás seguro que deseas eliminar al barbero ${barbero.nombre_completo}?`)) {
      this.barberoService.deleteBarbero(barbero.barbero_id).subscribe({
        next: () => {
          // Removemos el barbero de la lista en memoria
          this.barberos = this.barberos.filter(b => b.barbero_id !== barbero.barbero_id);
          this.cdr.detectChanges(); // Forzamos a Angular a actualizar el DOM
          
          // Re-inicializamos DataTables para que no queden datos "cacheados" visualmente
          this.inicializarDataTable(); 
          alert('Barbero eliminado con éxito.');
        },
        error: (err) => {
          console.error('Error al eliminar barbero:', err);
          alert('Hubo un error al eliminar el barbero. Puede que tenga turnos asociados.');
        }
      });
    }
  }

  /** Exporta el listado de barberos a archivo PDF */
  exportPdf() {
    const columnas = ['Nombre', 'Especialidad', 'Activo'];
    const datos = this.barberos.map(b => [b.nombre_completo, b.especialidad, b.activo ? 'Sí' : 'No']);
    this.exportService.exportarPdf('Listado de Barberos', columnas, datos, 'barberos');
  }

  /** Exporta el listado de barberos a archivo Excel */
  exportExcel() {
    const columnas = ['Nombre', 'Especialidad', 'Activo'];
    const datos = this.barberos.map(b => [b.nombre_completo, b.especialidad, b.activo ? 'Sí' : 'No']);
    this.exportService.exportarExcel('Barberos', columnas, datos, 'barberos');
  }
}
