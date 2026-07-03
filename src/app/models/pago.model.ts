export interface Pago {
  pago_id: string;
  turno_id: string;
  monto_total: number;
  metodo_pago: 'TARJETA' | 'EFECTIVO' | 'TRANSFERENCIA' | 'QR';
  estado_pago: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'CANCELADO' | 'REEMBOLSADO';
  fecha_pago?: string;
  nombreCliente?: string;
  servicio?: string;
}
