import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BarberoPanelService } from '../../../services/barbero/barbero-panel.service';
import { AuthService } from '../../../services/auth/auth.service';
import { environment } from '../../../../environments/environment';
import QRCode from 'qrcode';

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

  mostrarModalError = false;
  mensajeModalError = '';

  mostrarModalCobro = false;
  turnoCobrar: any = null;
  procesandoCobro = false;

  mostrarModalQR = false;
  qrImageUrl: string = '';
  checkoutUrl: string = '';

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

  iniciarAtencion(turnoId: string): void {
    this.barberoPanelService.marcarAtendido(turnoId, 'EN_ATENCION').subscribe({
      next: () => this.cargarAgenda(),
      error: (err) => {
        const mensaje = err?.error?.error || 'No se pudo actualizar el turno.';
        this.mensajeModalError = mensaje;
        this.mostrarModalError = true;
        this.cdr.detectChanges();
      }
    });
  }

  finalizarAtencion(turnoId: string): void {
    this.barberoPanelService.marcarAtendido(turnoId, 'ATENDIDO').subscribe({
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

  abrirModalCobro(turno: any): void {
    this.turnoCobrar = turno;
    this.mostrarModalCobro = true;
    this.cdr.detectChanges();
  }

  cerrarModalCobro(): void {
    this.mostrarModalCobro = false;
    this.turnoCobrar = null;
    this.procesandoCobro = false;
  }

  cobrarEfectivo(): void {
    if (!this.turnoCobrar) return;
    this.procesandoCobro = true;
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post(`${environment.API_BASE_URL}/pagos/registrar-efectivo`,
      { turnoId: this.turnoCobrar.turno_id },
      { headers }
    ).subscribe({
      next: () => {
        const turno = this.turnosHoy.find(t => t.turno_id === this.turnoCobrar.turno_id);
        if (turno) turno.cobrado = true;
        this.cerrarModalCobro();
        this.cargarAgenda();
      },
      error: (err) => {
        this.cerrarModalCobro();
        const mensaje = err?.error?.error || 'No se pudo registrar el pago.';
        this.mensajeModalError = mensaje;
        this.mostrarModalError = true;
        this.cdr.detectChanges();
      }
    });
  }

  async cobrarOnline(): Promise<void> {
    if (!this.turnoCobrar) return;
    this.procesandoCobro = true;
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post(`${environment.API_BASE_URL}/pagos/generar`,
      { turnoId: this.turnoCobrar.turno_id },
      { headers }
    ).subscribe({
      next: async (data: any) => {
        this.checkoutUrl = data.checkoutUrl;
        this.qrImageUrl = await QRCode.toDataURL(data.checkoutUrl);
        this.cerrarModalCobro();
        this.mostrarModalQR = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cerrarModalCobro();
        const mensaje = err?.error?.error || 'No se pudo generar el link de pago.';
        this.mensajeModalError = mensaje;
        this.mostrarModalError = true;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarModalQR(): void {
    this.mostrarModalQR = false;
    this.qrImageUrl = '';
    this.checkoutUrl = '';
  }
}