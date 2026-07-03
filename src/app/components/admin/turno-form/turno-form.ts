import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';

@Component({
  selector: 'app-turno-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './turno-form.html'
})
export class TurnoForm implements OnInit {
  private turnoService = inject(TurnoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  turnoId: string | null = null;
  esEdicion = false;
  cargando = false;

  turno: any = {
    fecha: '',
    hora_inicio: '10:00:00',
    hora_fin: '10:30:00',
    estado: 'PENDIENTE',
    cliente_id: '',
    barbero_id: '',
    servicio_id: '',
    notas: ''
  };

  ngOnInit() {
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
        this.turno = { ...encontrado };
      }
    });
  }

  guardar() {
    this.cargando = true;
    if (this.esEdicion) {
      this.turnoService.updateTurno(this.turnoId!, this.turno).subscribe({
        next: () => {
          alert('Turno actualizado');
          this.router.navigate(['/admin/turnos']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar');
          this.cargando = false;
        }
      });
    } else {
      this.turnoService.createTurno(this.turno).subscribe({
        next: () => {
          alert('Turno creado');
          this.router.navigate(['/admin/turnos']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear');
          this.cargando = false;
        }
      });
    }
  }
}
