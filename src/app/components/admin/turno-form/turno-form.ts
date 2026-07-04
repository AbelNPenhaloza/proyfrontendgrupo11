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

  // Listas para los desplegables
  barberos: any[] = [];
  servicios: any[] = [];
  clientes: any[] = [];

  turno: any = {
    fecha: '',
    hora_inicio: '10:00',
    hora_fin: '10:30',
    estado: 'PENDIENTE',
    cliente_id: '',
    barbero_id: '',
    servicio_id: '',
    notas: ''
  };

  ngOnInit() {
    // Cargar listas para los desplegables con manejo de errores y formatos
    this.barberoService.getBarberos().subscribe({
      next: (data: any) => {
        this.barberos = Array.isArray(data) ? data : (data.barberos || data.data || []);
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
        // Solo mostrar los que son clientes, o mostrarlos todos si quieres
        this.clientes = usuarios;
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
          hora_fin: encontrado.hora_fin?.substring(0, 5) || '',
          estado: encontrado.estado,
          cliente_id: encontrado.cliente_id,
          barbero_id: encontrado.barbero_id,
          servicio_id: encontrado.servicio_id,
          notas: encontrado.notas || ''
        };
      }
    });
  }

  guardar() {
    this.cargando = true;

    // Formatear horas para el backend (HH:mm:ss)
    const datos = {
      ...this.turno,
      hora_inicio: this.turno.hora_inicio.length === 5 ? this.turno.hora_inicio + ':00' : this.turno.hora_inicio,
      hora_fin: this.turno.hora_fin.length === 5 ? this.turno.hora_fin + ':00' : this.turno.hora_fin
    };

    if (this.esEdicion) {
      this.turnoService.updateTurno(this.turnoId!, datos).subscribe({
        next: () => {
          alert('Turno actualizado correctamente');
          this.router.navigate(['/admin/turnos']);
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
          alert('Turno creado correctamente');
          this.router.navigate(['/admin/turnos']);
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
