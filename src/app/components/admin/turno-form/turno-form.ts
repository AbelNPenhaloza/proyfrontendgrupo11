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
