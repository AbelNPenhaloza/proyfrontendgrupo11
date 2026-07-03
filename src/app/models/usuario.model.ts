export interface Usuario {
  usuario_id: string;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  rol: 'CLIENTE' | 'ADMINISTRADOR' | 'RECEPCIONISTA' | 'BARBERO';
  activo: boolean;
}
