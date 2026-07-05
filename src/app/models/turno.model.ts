export interface Turno {
  turno_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'ATENDIDO' | 'CANCELADO';
  cliente_id: string;
  barbero_id: string;
  servicio_id: string;
  notas?: string;
  nombreCliente?: string;
  nombreBarbero?: string;
  nombreServicio?: string;
  precioServicio?: number;
}
