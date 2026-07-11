import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';
import { BarberoService } from '../../../services/barbero.service';
import { ServicioService } from '../../../services/servicio.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-turno-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './turno-form.html'
})
export class TurnoForm implements OnInit {
  private turnoService = inject(TurnoService);
  private barberoService = inject(BarberoService);
  private servicioService = inject(ServicioService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  turnoId: string | null = null;
  esEdicion = false;
  cargando = false;
  guardado = false;

  // Listas para los desplegables
  barberos: any[] = [];
  servicios: any[] = [];
  clientes: any[] = [];

  // --- Búsqueda de cliente ---
  busquedaCliente: string = '';
  clientesFiltrados: any[] = [];
  mostrarDropdown = false;

  // Lista de horarios traída del backend
  horariosDisponibles: any[] = [];
  cargandoHorarios = false;

  turno: any = {
    fecha: '',
    hora_inicio: '10:00',
    clienteId: '',
    barberoId: '',
    servicioId: '',
    notas: ''
  };

  ngOnInit() {
    // Cargar listas para los desplegables con manejo de errores y formatos
    this.barberoService.getBarberos().subscribe({
      next: (data: any) => {
        const listaBarberos = Array.isArray(data) ? data : (data.barberos || data.data || []);
        // Solo mostrar barberos activos en el formulario
        this.barberos = listaBarberos.filter((b: any) => b.activo !== false);
      },
      error: (err) => console.error('Error cargando barberos:', err)
    });

    this.servicioService.getServicios().subscribe({
      next: (data: any) => {
        this.servicios = Array.isArray(data) ? data : (data.servicios || data.data || []);
      },
      error: (err) => console.error('Error cargando servicios:', err)
    });

    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        const usuarios = Array.isArray(data) ? data : (data.usuarios || data.data || []);
        // Solo mostrar clientes que estén activos
        this.clientes = usuarios.filter((u: any) => u.activo !== false);
        this.clientesFiltrados = this.clientes;
        this.sincronizarClienteSeleccionado();
        this.seleccionarClienteRecienCreado();
      },
      error: (err) => console.error('Error cargando clientes:', err)
    });

    this.turnoId = this.route.snapshot.paramMap.get('id');
    if (this.turnoId) {
      this.esEdicion = true;
      this.cargarTurno(this.turnoId);
    }
  }

  cargarTurno(id: string) {
    this.turnoService.getTurnos().subscribe(turnos => {
      const encontrado = turnos.find(t => t.turno_id === id);
      if (encontrado) {
        this.turno = {
          fecha: encontrado.fecha,
          hora_inicio: encontrado.hora_inicio?.substring(0, 5) || '',
          clienteId: encontrado.cliente_id,
          barberoId: encontrado.barbero_id,
          servicioId: encontrado.servicio_id,
          notas: encontrado.notas || ''
        };
        this.sincronizarClienteSeleccionado();
      }
    });
  }

  /**
   * Consulta al backend los horarios disponibles según el barbero, servicio y fecha.
   */
  cargarHorariosDisponibles() {
    if (this.turno.barberoId && this.turno.fecha && this.turno.servicioId) {
      this.cargandoHorarios = true;
      this.turnoService.getDisponibilidad(this.turno.barberoId, this.turno.fecha, this.turno.servicioId)
        .subscribe({
          next: (res) => {
            this.horariosDisponibles = res.horariosDisponibles || [];
            this.cargandoHorarios = false;
            // Si el horario seleccionado previamente ya no está disponible, lo limpiamos
            if (this.turno.hora_inicio && !this.horariosDisponibles.some(h => h.hora_inicio === this.turno.hora_inicio)) {
              this.turno.hora_inicio = '';
            }
          },
          error: (err) => {
            console.error('Error al cargar horarios:', err);
            this.horariosDisponibles = [];
            this.cargandoHorarios = false;
          }
        });
    }
  }

  // ============================
  // Búsqueda / selección de cliente
  // ============================

  /** Normaliza texto para comparar sin importar tildes/mayúsculas */
  private normalizar(texto: string): string {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /** Si ya tenemos clienteId (ej: modo edición) y llegaron los clientes, mostramos el texto */
  private sincronizarClienteSeleccionado() {
    if (this.turno.clienteId && this.clientes.length) {
      const cliente = this.clientes.find(c => c.usuario_id === this.turno.clienteId);
      if (cliente) {
        this.busquedaCliente = `${cliente.nombre} ${cliente.apellido} (${cliente.email})`;
      }
    }
  }

  /** Si venimos de crear un usuario nuevo desde este mismo form, lo seleccionamos automáticamente */
  private seleccionarClienteRecienCreado() {
    const clienteCreadoId = this.route.snapshot.queryParamMap.get('clienteCreadoId');
    if (clienteCreadoId) {
      const cliente = this.clientes.find(c => c.usuario_id === clienteCreadoId);
      if (cliente) {
        this.seleccionarCliente(cliente);
      } else {
        // Por si el usuario recién creado todavía no vino en el listado de "activos"
        this.turno.clienteId = clienteCreadoId;
      }

      // Limpiamos el queryParam de la URL para que no se reaplique en un refresh
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { clienteCreadoId: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  filtrarClientes() {
    this.mostrarDropdown = true;
    const termino = this.normalizar(this.busquedaCliente.trim());

    this.clientesFiltrados = !termino
      ? this.clientes
      : this.clientes.filter(c => {
          const nombreCompleto = this.normalizar(`${c.nombre} ${c.apellido}`);
          const email = this.normalizar(c.email || '');
          return nombreCompleto.includes(termino) || email.includes(termino);
        });

    // Si el texto ya no coincide con el cliente seleccionado, invalidamos la selección
    if (this.turno.clienteId) {
      const clienteActual = this.clientes.find(c => c.usuario_id === this.turno.clienteId);
      const textoActual = clienteActual
        ? `${clienteActual.nombre} ${clienteActual.apellido} (${clienteActual.email})`
        : '';
      if (textoActual !== this.busquedaCliente) {
        this.turno.clienteId = '';
      }
    }
  }

  seleccionarCliente(cliente: any) {
    this.turno.clienteId = cliente.usuario_id;
    this.busquedaCliente = `${cliente.nombre} ${cliente.apellido} (${cliente.email})`;
    this.mostrarDropdown = false;
  }

  /** Delay para que el click en un item del dropdown se registre antes de ocultarlo por el blur */
  ocultarDropdownConDelay() {
    setTimeout(() => this.mostrarDropdown = false, 200);
  }

  irACrearUsuario() {
    this.mostrarDropdown = false;
    const texto = this.busquedaCliente.trim();
    const esEmail = texto.includes('@');

    const queryParams: any = { returnUrl: this.router.url.split('?')[0] };

    if (esEmail) {
      queryParams.email = texto;
    } else {
      const partes = texto.split(' ').filter(p => p);
      queryParams.nombre = partes[0] || '';
      queryParams.apellido = partes.slice(1).join(' ') || '';
    }

    this.router.navigate(['/admin/usuarios/crear'], { queryParams });
  }

  guardar() {
    this.cargando = true;

    // Formatear horas para el backend (HH:mm:ss) y ajustar los nombres de campos
    const datos = {
      clienteId: this.turno.clienteId,
      barberoId: this.turno.barberoId,
      servicioId: this.turno.servicioId,
      fecha: this.turno.fecha,
      hora_inicio: this.turno.hora_inicio,
      notas: this.turno.notas
    };

    if (this.esEdicion) {
      this.turnoService.updateTurno(this.turnoId!, datos).subscribe({
        next: () => {
          this.guardado = true;
          this.cargando = false;
          setTimeout(() => {
            this.router.navigate(['/admin/turnos']);
          }, 2000);
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar: ' + (err.error?.mensaje || err.error?.message || err.message));
          this.cargando = false;
        }
      });
    } else {
      this.turnoService.createTurno(datos).subscribe({
        next: () => {
          this.guardado = true;
          this.cargando = false;
          setTimeout(() => {
            this.router.navigate(['/admin/turnos']);
          }, 2000);
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear: ' + (err.error?.mensaje || err.error?.message || err.message));
          this.cargando = false;
        }
      });
    }
  }
}