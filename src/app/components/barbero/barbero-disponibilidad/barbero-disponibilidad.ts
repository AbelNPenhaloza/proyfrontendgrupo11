import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberoPanelService } from '../../../services/barbero/barbero-panel.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-barbero-disponibilidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barbero-disponibilidad.html',
  styleUrl: './barbero-disponibilidad.css'
})
export class BarberoDisponibilidad implements OnInit {
  private barberoPanelService = inject(BarberoPanelService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  disponibilidad: any[] = [];
  barberoId: string = '';
  cargando = true;
  guardando = false;
  mensaje = '';

  diasSemana = [
    { numero: 1, nombre: 'Lunes' },
    { numero: 2, nombre: 'Martes' },
    { numero: 3, nombre: 'Miércoles' },
    { numero: 4, nombre: 'Jueves' },
    { numero: 5, nombre: 'Viernes' },
    { numero: 6, nombre: 'Sábado' },
  ];

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.barberoId = payload.barbero_id;
    }
    this.cargarDisponibilidad(); // o cargarTurnos() o cargarDisponibilidad()
  }

  cargarDisponibilidad(): void {
    this.cargando = true;
    this.barberoPanelService.getDisponibilidad(this.barberoId).subscribe({
      next: (data) => {
        this.disponibilidad = Array.isArray(data) ? data : data.disponibilidad || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.disponibilidad = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getNombreDia(numero: number): string {
    return this.diasSemana.find(d => d.numero === numero)?.nombre || '';
  }

  guardar(): void {
    this.guardando = true;
    this.barberoPanelService.updateDisponibilidad(this.barberoId, this.disponibilidad).subscribe({
      next: () => {
        this.mensaje = 'Disponibilidad actualizada correctamente.';
        this.guardando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'Error al actualizar disponibilidad.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }
}