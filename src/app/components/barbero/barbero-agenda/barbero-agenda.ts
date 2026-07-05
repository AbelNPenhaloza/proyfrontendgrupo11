import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberoPanelService } from '../../../services/barbero/barbero-panel.service';
import { AuthService } from '../../../services/auth/auth.service';

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

  turnos: any[] = [];
  fechaSeleccionada: string = new Date().toISOString().split('T')[0];
  barberoId: string = '';
  cargando = true;

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.barberoId = payload.usuario_id;
    }
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.cargando = true;
    this.barberoPanelService.getAgenda(this.barberoId, this.fechaSeleccionada).subscribe({
      next: (data) => {
        this.turnos = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  marcarAtendido(turnoId: string): void {
    this.barberoPanelService.marcarAtendido(turnoId).subscribe({
      next: () => this.cargarTurnos()
    });
  }
}