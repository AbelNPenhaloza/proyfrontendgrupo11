import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BarberoPanelService } from '../../../services/barbero/barbero-panel.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-barbero-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './barbero-dashboard.html',
  styleUrl: './barbero-dashboard.css'
})
export class BarberosDashboard implements OnInit {
  private barberoPanelService = inject(BarberoPanelService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  turnosHoy: any[] = [];
  fechaHoy: string = new Date().toISOString().split('T')[0];
  barberoId: string = '';
  cargando = true;

  // --- Estado del modal de error (mismo patrón que en Mi Agenda) ---
  mostrarModalError = false;
  mensajeModalError = '';

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.barberoId = payload.barbero_id;
    }
    this.cargarAgenda(); 
  }

  cargarAgenda(): void {
    this.cargando = true;
    this.barberoPanelService.getAgenda(this.barberoId, this.fechaHoy).subscribe({
      next: (data) => {
        this.turnosHoy = Array.isArray(data) ? data : data.turnos || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.turnosHoy = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  marcarAtendido(turnoId: string): void {
    this.barberoPanelService.marcarAtendido(turnoId).subscribe({
      next: () => this.cargarAgenda(),
      error: (err) => {
        const mensaje = err?.error?.error || 'No se pudo actualizar el turno.';
        this.mensajeModalError = mensaje;
        this.mostrarModalError = true;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
    this.mensajeModalError = '';
  }

  cobrar(turno: any): void {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post('http://localhost:3000/api/pagos/generar',
      { turnoId: turno.turno_id },
      { headers }
    ).subscribe({
      next: (data: any) => {
        window.open(data.checkoutUrl, '_blank');
      },
      error: (err) => {
        console.error('Error al generar pago:', err);
      }
    });
  }
}