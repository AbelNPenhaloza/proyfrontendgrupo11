import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { ExportService } from '../../../services/export.service';
import { Usuario } from '../../../models/usuario.model';

declare var $: any;

/**
 * Componente tabla de usuarios con jQuery DataTables.
 * Muestra listado de usuarios con búsqueda, paginación y acciones CRUD.
 * Incluye exportación a PDF y Excel.
 */
@Component({
  selector: 'app-usuarios-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './usuarios-table.html',
  styleUrl: './usuarios-table.css'
})
export class UsuariosTable implements OnInit, AfterViewInit {
  /** Array de usuarios cargados desde el servicio mock */
  usuarios: Usuario[] = [];

  /** Flag de carga */
  cargando = true;

  /** Flag para evitar reinicialización múltiple de DataTables */
  private tablaInicializada = false;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private usuarioService: UsuarioService,
    private exportService: ExportService
  ) {}

  /** Carga los usuarios al inicializar el componente */
  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log('Usuarios recibidos en componente:', data);
        this.usuarios = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.inicializarDataTable();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {}

  private inicializarDataTable() {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#usuariosTable')) {
        $('#usuariosTable').DataTable().destroy();
      }
      if ($('#usuariosTable').length) {
        $('#usuariosTable').DataTable({
          responsive: true,
          language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json' },
          pageLength: 10,
          order: [[0, 'asc']]
        });
      }
    }, 100);
  }

  /**
   * Retorna la clase CSS del badge según el rol del usuario.
   * @param rol - Rol del usuario (ADMINISTRADOR, BARBERO, CLIENTE, RECEPCIONISTA)
   * @returns Clase CSS de Bootstrap para el badge
   */
  getBadgeRol(rol: string): string {
    const classes: Record<string, string> = {
      'ADMINISTRADOR': 'badge bg-danger', 'BARBERO': 'badge bg-primary',
      'CLIENTE': 'badge bg-success', 'RECEPCIONISTA': 'badge bg-info'
    };
    return classes[rol] || 'badge bg-secondary';
  }

  /**
   * Navega al formulario de edición del usuario.
   * @param usuario - Usuario a editar
   */
  editarUsuario(usuario: Usuario) {
    console.log('Editar usuario:', usuario.usuario_id);
  }

  /**
   * Elimina un usuario tras confirmación del usuario.
   * @param usuario - Usuario a eliminar
   */
  eliminarUsuario(usuario: Usuario) {
    console.log('Eliminar usuario:', usuario.usuario_id);
  }

  /** Exporta el listado de usuarios a archivo PDF */
  exportPdf() {
    const columnas = ['Nombre', 'Email', 'Rol', 'Activo'];
    const datos = this.usuarios.map(u => [`${u.nombre} ${u.apellido}`, u.email, u.rol, u.activo ? 'Sí' : 'No']);
    this.exportService.exportarPdf('Listado de Usuarios', columnas, datos, 'usuarios');
  }

  /** Exporta el listado de usuarios a archivo Excel */
  exportExcel() {
    const columnas = ['Nombre', 'Email', 'Rol', 'Activo'];
    const datos = this.usuarios.map(u => [`${u.nombre} ${u.apellido}`, u.email, u.rol, u.activo ? 'Sí' : 'No']);
    this.exportService.exportarExcel('Usuarios', columnas, datos, 'usuarios');
  }
}
