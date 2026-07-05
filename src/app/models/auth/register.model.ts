export interface RegisterModel {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  celular: string;
  rol?: string; // Opcional, ya que el backend por defecto pone 'CLIENTE'
}