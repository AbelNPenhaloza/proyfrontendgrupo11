import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  turnosHoy: any[] = [];
  fechaHoy: string = new Date().toISOString().split('T')[0];
  barberoId: string = '';
  cargando = true;

  ngOnInit(): void {
    // Obtener barberoId del token
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.barberoId = payload.usuario_id;
    }
    this.cargarAgenda();
  }

  cargarAgenda(): void {
    this.cargando = true;
    this.barberoPanelService.getAgenda(this.barberoId, this.fechaHoy).subscribe({
      next: (data) => {
        this.turnosHoy = Array.isArray(data) ? data : data.turnos || [];
        this.cargando = false;
      },
      error: () => {
        this.turnosHoy = [];
        this.cargando = false;
      }
    });
  }

  marcarAtendido(turnoId: string): void {
    this.barberoPanelService.marcarAtendido(turnoId).subscribe({
      next: () => this.cargarAgenda()
    });
  }
}