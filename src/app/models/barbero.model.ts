export interface Barbero {
  barbero_id: string;
  nombre_completo: string;
  especialidad: 'DEGRADADOS' | 'CLASICO' | 'BARBA' | 'COLORISTA';
  foto_url?: string;
  activo: boolean;
}
