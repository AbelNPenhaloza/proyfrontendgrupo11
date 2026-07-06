import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberoPanelService } from '../../../services/barbero/barbero-panel.service';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-barbero-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barbero-agenda.html',
  styleUrl: './barbero-agenda.css'
})
export class BarberoAgenda implements OnInit {
  private barberoPanelService = inject(BarberoPanelService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  turnos: any[] = [];
  fechaSeleccionada: string = new Date().toISOString().split('T')[0];
  barberoId: string = '';
  cargando = true;

  // --- Estado del modal de error ---
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
    this.barberoPanelService.getAgenda(this.barberoId, this.fechaSeleccionada).subscribe({
      next: (data) => {
        this.turnos = Array.isArray(data) ? data : data.turnos || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.turnos = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  marcarAtendido(turnoId: string): void {
    this.barberoPanelService.marcarAtendido(turnoId).subscribe({
      next: () => this.cargarAgenda(),
      error: (err) => {
        // El backend devuelve 400 con { error: '...' } cuando la fecha del turno no llegó todavía
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