import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditoriaService } from '../../../services/auditoria.service';
import { ExportService } from '../../../services/export.service';

declare var $: any;

@Component({
  selector: 'app-auditoria-table',
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './auditoria-table.html',
  styleUrl: './auditoria-table.css'
})
export class AuditoriaTable implements OnInit {
  logs: any[] = [];
  cargando = true;

  private auditoriaService = inject(AuditoriaService);
  private exportService = inject(ExportService);
  private cdr = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe);

  ngOnInit() {
    this.auditoriaService.getLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.inicializarDataTable();
      },
      error: (err) => {
        console.error('Error al cargar auditoría:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private inicializarDataTable() {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#auditoriaTable')) {
        $('#auditoriaTable').DataTable().destroy();
      }
      if ($('#auditoriaTable').length) {
        $('#auditoriaTable').DataTable({
          responsive: true,
          language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json' },
          pageLength: 10,
          order: [[3, 'desc']] // Ordena por la columna de Fecha
        });
      }
    }, 100);
  }

  exportPdf() {
    const columnas = ['Usuario', 'Email', 'Acción', 'Fecha', 'IP'];
    const datos = this.logs.map(l => [
      l.Usuario ? `${l.Usuario.nombre} ${l.Usuario.apellido}` : 'Desconocido',
      l.Usuario ? l.Usuario.email : '-',
      l.accion,
      this.datePipe.transform(l.fecha, 'dd/MM/yyyy HH:mm:ss') || '',
      l.ip_origen
    ]);
    this.exportService.exportarPdf('Historial de Accesos', columnas, datos, 'auditoria');
  }

  exportExcel() {
    const columnas = ['Usuario', 'Email', 'Acción', 'Fecha', 'IP'];
    const datos = this.logs.map(l => [
      l.Usuario ? `${l.Usuario.nombre} ${l.Usuario.apellido}` : 'Desconocido',
      l.Usuario ? l.Usuario.email : '-',
      l.accion,
      this.datePipe.transform(l.fecha, 'dd/MM/yyyy HH:mm:ss') || '',
      l.ip_origen
    ]);
    this.exportService.exportarExcel('Auditoria', columnas, datos, 'auditoria');
  }
}