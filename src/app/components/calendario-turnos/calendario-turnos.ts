import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth/auth.service';
import { BarberoService } from '../../services/barbero.service';
import { Servicio } from '../../models/servicio.model';
import { Turno } from '../../models/turno.model';
import { Barbero } from '../../models/barbero.model';

@Component({
  selector: 'app-calendario-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, RouterLink],
  templateUrl: './calendario-turnos.html',
  styleUrl: './calendario-turnos.css',
})
export class CalendarioTurnos implements OnInit {
  private turnoService = inject(TurnoService);
  private authService = inject(AuthService);
  private barberoService = inject(BarberoService);
  private cdr = inject(ChangeDetectorRef);

  // Listado de servicios y turnos cargados
  servicios: Servicio[] = [];
  turnos: Turno[] = [];
  servicioSeleccionado: Servicio | null = null;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  // Estado del modal de reserva
  modalAbierto = false;
  fechaModal = '';
  horariosDisponibles: { hora_inicio: string; hora_fin: string }[] = [];
  horarioSeleccionado: { hora_inicio: string; hora_fin: string } | null = null;
  cargandoHorarios = false;
  cargandoReserva = false;

  // Estado del modal de detalle de turno
  modalDetalleAbierto = false;
  turnoDetalle: any = null;

  // Fecha minima: no se puede reservar en el pasado
  readonly fechaMinima = new Date().toISOString().split('T')[0];

  // Listado de barberos para que el cliente elija
  barberosActivos: Barbero[] = [];
  barberoSeleccionadoId: string = '';

  // Opciones de configuración de FullCalendar
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    firstDay: 1,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    selectable: false,
    eventClick: this.handleEventClick.bind(this),
    events: [] // Se poblará dinámicamente con los turnos cargados
  };

  constructor() {
    console.log('[CalendarioTurnos] Constructor invocado');
  }

  ngOnInit(): void {
    console.log('[CalendarioTurnos] ngOnInit invocado');
    this.cargarServicios();
    this.cargarTurnosDelCalendario();
    this.cargarBarberosActivos();
  }

  cargarBarberosActivos(): void {
    this.barberoService.getBarberosActivos().subscribe({
      next: (barberos) => {
        this.barberosActivos = barberos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[CalendarioTurnos] Error al cargar barberos', err)
    });
  }

  /**
   * Carga el catálogo de servicios desde el backend.
   */
  cargarServicios(): void {
    console.log('[CalendarioTurnos] Iniciando getServicios()...');
    this.turnoService.getServicios().subscribe({
      next: (res) => {
        console.log('[CalendarioTurnos] getServicios() completado. Servicios recibidos:', res);
        this.servicios = res.filter(s => s.activo);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[CalendarioTurnos] Error en getServicios():', err);
        this.mensajeError = 'No se pudo cargar el catálogo de servicios.';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Obtiene todos los turnos registrados para mostrarlos dinámicamente en el calendario.
   */
  cargarTurnosDelCalendario(): void {
    console.log('[CalendarioTurnos] Cargando turnos para poblar el calendario...');
    this.turnoService.getTurnos().subscribe({
      next: (turnosRegistrados) => {
        this.turnos = turnosRegistrados;

        const miUsuarioId = this.authService.getUsuarioId();

        // Mapear los turnos al formato que FullCalendar requiere,
        // filtrando SOLO los turnos del cliente logueado (privacidad)
        const eventosMapeados = this.turnos
          .filter(t => t.estado !== 'CANCELADO' && t.cliente_id === miUsuarioId)
          .map(t => ({
            title: t.nombreServicio || 'Turno Reservado',
            start: `${t.fecha}T${t.hora_inicio}`,
            end: `${t.fecha}T${t.hora_fin}`,
            color: '#14213D', // Azul marino oficial
            textColor: '#F4F1DE', // Arena/Crema oficial para legibilidad
            borderColor: '#5C3D2E', // Marrón oficial para el borde del evento
            extendedProps: {
              barbero: t.nombreBarbero,
              precio: t.precioServicio,
              estado: t.estado,
              horaInicio: t.hora_inicio,
              horaFin: t.hora_fin,
              fechaFormateada: t.fecha
            }
          }));

        // Actualizar las opciones del calendario con los nuevos eventos
        this.calendarOptions = {
          ...this.calendarOptions,
          events: eventosMapeados
        };

        console.log('[CalendarioTurnos] Eventos cargados en el calendario:', eventosMapeados);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[CalendarioTurnos] Error al cargar los turnos del calendario:', err);
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Abre el modal limpio al seleccionar un servicio.
   */
  abrirModal(servicio: Servicio): void {
    console.log('[CalendarioTurnos] Abriendo modal para servicio:', servicio.nombre);
    this.servicioSeleccionado = servicio;
    this.modalAbierto = true;
    this.fechaModal = '';
    this.barberoSeleccionadoId = '';
    this.horariosDisponibles = [];
    this.horarioSeleccionado = null;
    this.mensajeExito = null;
    this.mensajeError = null;
    this.cargandoHorarios = false;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.servicioSeleccionado = null;
    this.fechaModal = '';
    this.barberoSeleccionadoId = '';
    this.horariosDisponibles = [];
    this.horarioSeleccionado = null;
    this.cdr.detectChanges();
  }

  /**
   * Maneja el click sobre un turno en el calendario visual.
   */
  handleEventClick(info: any): void {
    const props = info.event.extendedProps;
    this.turnoDetalle = {
      servicio: info.event.title,
      fecha: props.fechaFormateada,
      horaInicio: props.horaInicio,
      horaFin: props.horaFin,
      barbero: props.barbero,
      precio: props.precio,
      estado: props.estado
    };
    this.modalDetalleAbierto = true;
    this.cdr.detectChanges();
  }

  cerrarModalDetalle(): void {
    this.modalDetalleAbierto = false;
    this.turnoDetalle = null;
    this.cdr.detectChanges();
  }

  /**
   * Si cambia el barbero, limpiar horarios y buscar de nuevo si ya hay fecha.
   */
  onBarberoChange(): void {
    if (this.fechaModal) {
      this.onFechaChange();
    }
  }

  /**
   * Cuando el usuario cambia la fecha, consulta los horarios disponibles al backend.
   */
  onFechaChange(): void {
    this.horarioSeleccionado = null;
    this.horariosDisponibles = [];

    if (!this.fechaModal || !this.servicioSeleccionado || !this.barberoSeleccionadoId) return;

    this.cargandoHorarios = true;
    this.cdr.detectChanges();

    console.log('[CalendarioTurnos] Consultando disponibilidad para fecha:', this.fechaModal);
    this.turnoService.getDisponibilidad(
      this.barberoSeleccionadoId,
      this.fechaModal,
      this.servicioSeleccionado.servicio_id
    ).subscribe({
      next: (res) => {
        console.log('[CalendarioTurnos] Disponibilidad recibida:', res);
        this.horariosDisponibles = res.horariosDisponibles || [];
        this.cargandoHorarios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[CalendarioTurnos] Error al consultar disponibilidad:', err);
        this.cargandoHorarios = false;
        this.mensajeError = 'No se pudo consultar la disponibilidad para esa fecha.';
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarHorario(horario: { hora_inicio: string; hora_fin: string }): void {
    this.horarioSeleccionado = horario;
    this.cdr.detectChanges();
  }

  /**
   * Confirma y envía el turno al backend.
   */
  confirmarReserva(): void {
    const clienteId = this.authService.getUsuarioId();
    if (!clienteId) {
      this.mensajeError = 'No se pudo verificar la sesión. Por favor, reingresa.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.servicioSeleccionado || !this.fechaModal || !this.horarioSeleccionado || !this.barberoSeleccionadoId) return;

    this.cargandoReserva = true;
    this.cdr.detectChanges();
    
    const turno = {
      fecha: this.fechaModal,
      hora_inicio: this.horarioSeleccionado.hora_inicio,
      clienteId: clienteId,
      barberoId: this.barberoSeleccionadoId,
      servicioId: this.servicioSeleccionado.servicio_id,
      notas: 'Reserva desde la vista cliente'
    };

    console.log('[CalendarioTurnos] Enviando reserva al backend:', turno);
    this.turnoService.crearTurno(turno).subscribe({
      next: (res) => {
        const turnoId = res.turno?.turno_id;

        if (turnoId) {
          this.mensajeExito = `Turno reservado. Redirigiendo a MercadoPago...`;
          this.cdr.detectChanges();

          this.turnoService.generarPago(turnoId).subscribe({
            next: (pagoRes) => {
              if (pagoRes.checkoutUrl) {
                window.location.href = pagoRes.checkoutUrl;
              }
            },
            error: () => {
              this.cargandoReserva = false;
              this.mensajeError = 'Turno creado pero falló la redirección a MercadoPago.';
              this.cdr.detectChanges();
            }
          });
        } else {
          this.cargandoReserva = false;
          this.mensajeExito = `Turno reservado el ${this.fechaModal} a las ${this.horarioSeleccionado!.hora_inicio}.`;
          this.cerrarModal();
          this.cargarTurnosDelCalendario();
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('[CalendarioTurnos] Error al reservar turno:', err);
        this.cargandoReserva = false;
        const msg = err.error?.error || 'No se pudo crear el turno.';
        this.mensajeError = msg;
        this.cdr.detectChanges();
      }
    });
  }
}