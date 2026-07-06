import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-pago',
  imports: [RouterLink],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class Pago implements OnInit {
  private route = inject(ActivatedRoute);
  private pagoService = inject(PagoService);

  estado = signal<'cargando' | 'exito' | 'error'>('cargando');
  mensajeError = signal<string>('');

  ngOnInit() {
    // Leemos la URL que devuelve MercadoPago
    this.route.queryParams.subscribe(params => {
      const paymentId = params['payment_id'];
      const status = params['status'];
      const externalReference = params['external_reference'];

      if (status === 'approved' && externalReference) {
        // El pago fue exitoso en MP, avisamos a nuestro backend
        this.pagoService.confirmarPagoMp({
          payment_id: paymentId,
          status: status,
          external_reference: externalReference
        }).subscribe({
          next: () => this.estado.set('exito'),
          error: () => {
            this.estado.set('error');
            this.mensajeError.set('El cobro se realizó, pero hubo un problema al sincronizar con nuestro sistema.');
          }
        });
      } else {
        // MP devolvió error, rechazado o pendiente
        this.estado.set('error');
        this.mensajeError.set('El pago fue rechazado o no se pudo completar. Intenta nuevamente.');
      }
    });
  }
}