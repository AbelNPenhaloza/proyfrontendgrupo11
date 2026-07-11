export interface Servicio {
  servicio_id: string;
  nombre: string;
  descripcion?: string;
  duracion_minutos: number;
  precio: number;
  activo: boolean;
}
