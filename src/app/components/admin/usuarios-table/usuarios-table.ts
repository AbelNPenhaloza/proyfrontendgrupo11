import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
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
  private router = inject(Router);

  constructor(
    private usuarioService: UsuarioService,
    private exportService: ExportService
  ) {}

  /** Carga los usuarios al inicializar el componente */
  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        console.log('Usuarios recibidos en componente:', data);
        
        // Extraer array real y manejar errores silenciosos
        if (Array.isArray(data)) {
          this.usuarios = data;
        } else if (data && data.usuarios) {
          this.usuarios = data.usuarios;
        } else if (data && data.data) {
          this.usuarios = data.data;
        } else {
          this.usuarios = [];
          if (data && data.mensaje) {
            console.error('Mensaje del servidor:', data.mensaje);
            alert('Error del servidor: ' + data.mensaje);
          }
        }
        
        this.cargando = false;
        
        // Forzar actualización del DOM
        this.cdr.detectChanges();
        
        // Inicializar tabla de forma segura
        if (!this.tablaInicializada) {
          this.inicializarDataTable();
          this.tablaInicializada = true;
        } else {
          const table = ($('#usuariosTable') as any).DataTable();
          table.destroy();
          this.cdr.detectChanges();
          this.inicializarDataTable();
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        alert('Error HTTP al cargar usuarios: ' + (err.error?.mensaje || err.message));
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {}

  private inicializarDataTable() {
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
    this.router.navigate(['/admin/usuarios/editar', usuario.usuario_id]);
  }

  /**
   * Elimina un usuario tras confirmación del usuario.
   * @param usuario - Usuario a eliminar
   */
  eliminarUsuario(usuario: Usuario) {
    if (confirm(`¿Estás seguro que deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      this.usuarioService.deleteUsuario(usuario.usuario_id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.usuario_id !== usuario.usuario_id);
          this.cdr.detectChanges();
          this.inicializarDataTable();
          alert('Usuario eliminado con éxito.');
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          alert('Hubo un error al eliminar el usuario.');
        }
      });
    }
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
