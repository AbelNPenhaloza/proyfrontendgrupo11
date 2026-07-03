import { Usuario } from '../models/usuario.model';
import { Barbero } from '../models/barbero.model';
import { Servicio } from '../models/servicio.model';
import { Turno } from '../models/turno.model';
import { Pago } from '../models/pago.model';

/**
 * Datos mock centralizados para el panel de administración.
 * Contiene arrays de prueba para cada entidad del sistema.
 * Estos datos se utilizan en todos los servicios mock
 * y serán reemplazados por llamadas HTTP al backend.
 */

/** 25 usuarios de prueba: clientes, barberos, admin y recepcionista */
export const MOCK_USUARIOS: Usuario[] = [
  { usuario_id: '1', nombre: 'Carlos', apellido: 'García', email: 'carlos@mail.com', celular: '1155551111', rol: 'CLIENTE', activo: true },
  { usuario_id: '2', nombre: 'María', apellido: 'López', email: 'maria@mail.com', celular: '1155552222', rol: 'CLIENTE', activo: true },
  { usuario_id: '3', nombre: 'Admin', apellido: 'Sistema', email: 'admin@mail.com', rol: 'ADMINISTRADOR', activo: true },
  { usuario_id: '4', nombre: 'Pedro', apellido: 'Martínez', email: 'pedro@mail.com', celular: '1155554444', rol: 'BARBERO', activo: true },
  { usuario_id: '5', nombre: 'Juan', apellido: 'Rodríguez', email: 'juan@mail.com', celular: '1155555555', rol: 'BARBERO', activo: true },
  { usuario_id: '6', nombre: 'Luis', apellido: 'Fernández', email: 'luis@mail.com', celular: '1155556666', rol: 'BARBERO', activo: true },
  { usuario_id: '7', nombre: 'Carlos', apellido: 'Gómez', email: 'carlosg@mail.com', celular: '1155557777', rol: 'BARBERO', activo: true },
  { usuario_id: '8', nombre: 'Andrés', apellido: 'López', email: 'andres@mail.com', celular: '1155558888', rol: 'BARBERO', activo: true },
  { usuario_id: '9', nombre: 'Lucía', apellido: 'Fernández', email: 'lucia@mail.com', celular: '1155559999', rol: 'RECEPCIONISTA', activo: true },
  { usuario_id: '10', nombre: 'Martín', apellido: 'Sánchez', email: 'martin@mail.com', celular: '1155560000', rol: 'CLIENTE', activo: true },
  { usuario_id: '11', nombre: 'Ana', apellido: 'Torres', email: 'ana@mail.com', celular: '1155561111', rol: 'CLIENTE', activo: true },
  { usuario_id: '12', nombre: 'Diego', apellido: 'Ruiz', email: 'diego@mail.com', celular: '1155562222', rol: 'CLIENTE', activo: true },
  { usuario_id: '13', nombre: 'Sofía', apellido: 'Díaz', email: 'sofia@mail.com', celular: '1155563333', rol: 'CLIENTE', activo: true },
  { usuario_id: '14', nombre: 'Mateo', apellido: 'Romero', email: 'mateo@mail.com', celular: '1155564444', rol: 'CLIENTE', activo: true },
  { usuario_id: '15', nombre: 'Valentina', apellido: 'Morales', email: 'valen@mail.com', celular: '1155565555', rol: 'CLIENTE', activo: true },
  { usuario_id: '16', nombre: 'Nicolás', apellido: 'Herrera', email: 'nico@mail.com', celular: '1155566666', rol: 'CLIENTE', activo: true },
  { usuario_id: '17', nombre: 'Camila', apellido: 'Castro', email: 'camila@mail.com', celular: '1155567777', rol: 'CLIENTE', activo: true },
  { usuario_id: '18', nombre: 'Sebastián', apellido: 'Vargas', email: 'seba@mail.com', celular: '1155568888', rol: 'CLIENTE', activo: false },
  { usuario_id: '19', nombre: 'Isabella', apellido: 'Mendoza', email: 'isa@mail.com', celular: '1155569999', rol: 'CLIENTE', activo: true },
  { usuario_id: '20', nombre: 'Tomás', apellido: 'Silva', email: 'tomas@mail.com', celular: '1155570000', rol: 'CLIENTE', activo: true },
  { usuario_id: '21', nombre: 'Paula', apellido: 'Reyes', email: 'paula@mail.com', celular: '1155571111', rol: 'CLIENTE', activo: true },
  { usuario_id: '22', nombre: 'Agustín', apellido: 'Ortega', email: 'agustin@mail.com', celular: '1155572222', rol: 'CLIENTE', activo: false },
  { usuario_id: '23', nombre: 'Julieta', apellido: 'Núñez', email: 'juli@mail.com', celular: '1155573333', rol: 'CLIENTE', activo: true },
  { usuario_id: '24', nombre: 'Emilio', apellido: 'Rojas', email: 'emilio@mail.com', celular: '1155574444', rol: 'CLIENTE', activo: true },
  { usuario_id: '25', nombre: 'Florencia', apellido: 'Medina', email: 'flor@mail.com', celular: '1155575555', rol: 'CLIENTE', activo: true },
];

/** 5 barberos de prueba con distintas especialidades */
export const MOCK_BARBEROS: Barbero[] = [
  { barbero_id: '1', nombre_completo: 'Pedro Martínez', especialidad: 'DEGRADADOS', activo: true },
  { barbero_id: '2', nombre_completo: 'Juan Rodríguez', especialidad: 'BARBA', activo: true },
  { barbero_id: '3', nombre_completo: 'Luis Fernández', especialidad: 'CLASICO', activo: true },
  { barbero_id: '4', nombre_completo: 'Carlos Gómez', especialidad: 'COLORISTA', activo: true },
  { barbero_id: '5', nombre_completo: 'Andrés López', especialidad: 'DEGRADADOS', activo: true },
];

/** 6 servicios de prueba con precios y duraciones */
export const MOCK_SERVICIOS: Servicio[] = [
  { servicio_id: '1', nombre: 'Corte Clásico', descripcion: 'Corte de cabello clásico', duracion_minutos: 30, precio: 3000, activo: true },
  { servicio_id: '2', nombre: 'Corte + Barba', descripcion: 'Corte completo con barba', duracion_minutos: 45, precio: 5000, activo: true },
  { servicio_id: '3', nombre: 'Degradado', descripcion: 'Corte degradado profesional', duracion_minutos: 40, precio: 4500, activo: true },
  { servicio_id: '4', nombre: 'Coloración', descripcion: 'Tinte y coloración capilar', duracion_minutos: 60, precio: 8000, activo: true },
  { servicio_id: '5', nombre: 'Diseño', descripcion: 'Diseño artístico en el corte', duracion_minutos: 45, precio: 6000, activo: true },
  { servicio_id: '6', nombre: 'Afeitado', descripcion: 'Afeitado con navaja y toalla caliente', duracion_minutos: 20, precio: 2500, activo: true },
];

/** 40 turnos de prueba distribuidos en varias semanas */
export const MOCK_TURNOS: Turno[] = [
  { turno_id: '1', fecha: '2026-07-02', hora_inicio: '09:00', hora_fin: '09:30', estado: 'CONFIRMADO', cliente_id: '1', barbero_id: '1', servicio_id: '1', nombreCliente: 'Carlos García', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '2', fecha: '2026-07-02', hora_inicio: '09:30', hora_fin: '10:15', estado: 'CONFIRMADO', cliente_id: '2', barbero_id: '2', servicio_id: '2', nombreCliente: 'María López', nombreBarbero: 'Juan Rodríguez', nombreServicio: 'Corte + Barba', precioServicio: 5000 },
  { turno_id: '3', fecha: '2026-07-02', hora_inicio: '10:00', hora_fin: '10:40', estado: 'PENDIENTE', cliente_id: '10', barbero_id: '3', servicio_id: '3', nombreCliente: 'Martín Sánchez', nombreBarbero: 'Luis Fernández', nombreServicio: 'Degradado', precioServicio: 4500 },
  { turno_id: '4', fecha: '2026-07-02', hora_inicio: '10:30', hora_fin: '11:30', estado: 'ATENDIDO', cliente_id: '11', barbero_id: '4', servicio_id: '4', nombreCliente: 'Ana Torres', nombreBarbero: 'Carlos Gómez', nombreServicio: 'Coloración', precioServicio: 8000 },
  { turno_id: '5', fecha: '2026-07-02', hora_inicio: '11:00', hora_fin: '11:45', estado: 'CONFIRMADO', cliente_id: '12', barbero_id: '5', servicio_id: '5', nombreCliente: 'Diego Ruiz', nombreBarbero: 'Andrés López', nombreServicio: 'Diseño', precioServicio: 6000 },
  { turno_id: '6', fecha: '2026-07-02', hora_inicio: '11:30', hora_fin: '12:00', estado: 'CANCELADO', cliente_id: '13', barbero_id: '1', servicio_id: '6', nombreCliente: 'Sofía Díaz', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Afeitado', precioServicio: 2500 },
  { turno_id: '7', fecha: '2026-07-02', hora_inicio: '14:00', hora_fin: '14:30', estado: 'PENDIENTE', cliente_id: '14', barbero_id: '2', servicio_id: '1', nombreCliente: 'Mateo Romero', nombreBarbero: 'Juan Rodríguez', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '8', fecha: '2026-07-02', hora_inicio: '14:30', hora_fin: '15:15', estado: 'CONFIRMADO', cliente_id: '15', barbero_id: '3', servicio_id: '2', nombreCliente: 'Valentina Morales', nombreBarbero: 'Luis Fernández', nombreServicio: 'Corte + Barba', precioServicio: 5000 },
  { turno_id: '9', fecha: '2026-07-03', hora_inicio: '09:00', hora_fin: '09:40', estado: 'CONFIRMADO', cliente_id: '16', barbero_id: '1', servicio_id: '3', nombreCliente: 'Nicolás Herrera', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Degradado', precioServicio: 4500 },
  { turno_id: '10', fecha: '2026-07-03', hora_inicio: '10:00', hora_fin: '10:30', estado: 'PENDIENTE', cliente_id: '17', barbero_id: '4', servicio_id: '1', nombreCliente: 'Camila Castro', nombreBarbero: 'Carlos Gómez', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '11', fecha: '2026-07-03', hora_inicio: '10:30', hora_fin: '11:15', estado: 'ATENDIDO', cliente_id: '19', barbero_id: '2', servicio_id: '2', nombreCliente: 'Isabella Mendoza', nombreBarbero: 'Juan Rodríguez', nombreServicio: 'Corte + Barba', precioServicio: 5000 },
  { turno_id: '12', fecha: '2026-07-03', hora_inicio: '11:00', hora_fin: '11:40', estado: 'ATENDIDO', cliente_id: '20', barbero_id: '5', servicio_id: '3', nombreCliente: 'Tomás Silva', nombreBarbero: 'Andrés López', nombreServicio: 'Degradado', precioServicio: 4500 },
  { turno_id: '13', fecha: '2026-07-03', hora_inicio: '14:00', hora_fin: '15:00', estado: 'CONFIRMADO', cliente_id: '21', barbero_id: '3', servicio_id: '4', nombreCliente: 'Paula Reyes', nombreBarbero: 'Luis Fernández', nombreServicio: 'Coloración', precioServicio: 8000 },
  { turno_id: '14', fecha: '2026-07-04', hora_inicio: '09:00', hora_fin: '09:45', estado: 'ATENDIDO', cliente_id: '23', barbero_id: '1', servicio_id: '5', nombreCliente: 'Julieta Núñez', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Diseño', precioServicio: 6000 },
  { turno_id: '15', fecha: '2026-07-04', hora_inicio: '09:30', hora_fin: '10:00', estado: 'ATENDIDO', cliente_id: '24', barbero_id: '4', servicio_id: '6', nombreCliente: 'Emilio Rojas', nombreBarbero: 'Carlos Gómez', nombreServicio: 'Afeitado', precioServicio: 2500 },
  { turno_id: '16', fecha: '2026-07-04', hora_inicio: '10:00', hora_fin: '10:30', estado: 'CANCELADO', cliente_id: '25', barbero_id: '2', servicio_id: '1', nombreCliente: 'Florencia Medina', nombreBarbero: 'Juan Rodríguez', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '17', fecha: '2026-07-04', hora_inicio: '11:00', hora_fin: '11:40', estado: 'ATENDIDO', cliente_id: '1', barbero_id: '5', servicio_id: '3', nombreCliente: 'Carlos García', nombreBarbero: 'Andrés López', nombreServicio: 'Degradado', precioServicio: 4500 },
  { turno_id: '18', fecha: '2026-07-05', hora_inicio: '09:00', hora_fin: '09:30', estado: 'ATENDIDO', cliente_id: '2', barbero_id: '1', servicio_id: '1', nombreCliente: 'María López', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '19', fecha: '2026-07-05', hora_inicio: '10:00', hora_fin: '10:45', estado: 'ATENDIDO', cliente_id: '10', barbero_id: '3', servicio_id: '2', nombreCliente: 'Martín Sánchez', nombreBarbero: 'Luis Fernández', nombreServicio: 'Corte + Barba', precioServicio: 5000 },
  { turno_id: '20', fecha: '2026-07-05', hora_inicio: '11:00', hora_fin: '11:40', estado: 'ATENDIDO', cliente_id: '11', barbero_id: '2', servicio_id: '3', nombreCliente: 'Ana Torres', nombreBarbero: 'Juan Rodríguez', nombreServicio: 'Degradado', precioServicio: 4500 },
  { turno_id: '21', fecha: '2026-07-05', hora_inicio: '14:00', hora_fin: '15:00', estado: 'ATENDIDO', cliente_id: '12', barbero_id: '4', servicio_id: '4', nombreCliente: 'Diego Ruiz', nombreBarbero: 'Carlos Gómez', nombreServicio: 'Coloración', precioServicio: 8000 },
  { turno_id: '22', fecha: '2026-07-06', hora_inicio: '09:00', hora_fin: '09:45', estado: 'ATENDIDO', cliente_id: '13', barbero_id: '5', servicio_id: '5', nombreCliente: 'Sofía Díaz', nombreBarbero: 'Andrés López', nombreServicio: 'Diseño', precioServicio: 6000 },
  { turno_id: '23', fecha: '2026-07-06', hora_inicio: '10:00', hora_fin: '10:30', estado: 'CANCELADO', cliente_id: '14', barbero_id: '1', servicio_id: '1', nombreCliente: 'Mateo Romero', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '24', fecha: '2026-07-06', hora_inicio: '11:00', hora_fin: '11:30', estado: 'ATENDIDO', cliente_id: '15', barbero_id: '3', servicio_id: '6', nombreCliente: 'Valentina Morales', nombreBarbero: 'Luis Fernández', nombreServicio: 'Afeitado', precioServicio: 2500 },
  { turno_id: '25', fecha: '2026-07-07', hora_inicio: '09:00', hora_fin: '09:40', estado: 'ATENDIDO', cliente_id: '16', barbero_id: '2', servicio_id: '3', nombreCliente: 'Nicolás Herrera', nombreBarbero: 'Juan Rodríguez', nombreServicio: 'Degradado', precioServicio: 4500 },
  { turno_id: '26', fecha: '2026-07-07', hora_inicio: '10:00', hora_fin: '10:45', estado: 'ATENDIDO', cliente_id: '17', barbero_id: '4', servicio_id: '2', nombreCliente: 'Camila Castro', nombreBarbero: 'Carlos Gómez', nombreServicio: 'Corte + Barba', precioServicio: 5000 },
  { turno_id: '27', fecha: '2026-07-07', hora_inicio: '14:00', hora_fin: '15:00', estado: 'CONFIRMADO', cliente_id: '19', barbero_id: '1', servicio_id: '4', nombreCliente: 'Isabella Mendoza', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Coloración', precioServicio: 8000 },
  { turno_id: '28', fecha: '2026-07-07', hora_inicio: '15:00', hora_fin: '15:30', estado: 'PENDIENTE', cliente_id: '20', barbero_id: '5', servicio_id: '1', nombreCliente: 'Tomás Silva', nombreBarbero: 'Andrés López', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '29', fecha: '2026-07-01', hora_inicio: '09:00', hora_fin: '09:30', estado: 'ATENDIDO', cliente_id: '21', barbero_id: '3', servicio_id: '1', nombreCliente: 'Paula Reyes', nombreBarbero: 'Luis Fernández', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '30', fecha: '2026-07-01', hora_inicio: '10:00', hora_fin: '10:45', estado: 'ATENDIDO', cliente_id: '23', barbero_id: '1', servicio_id: '2', nombreCliente: 'Julieta Núñez', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Corte + Barba', precioServicio: 5000 },
  { turno_id: '31', fecha: '2026-07-01', hora_inicio: '11:00', hora_fin: '11:40', estado: 'CANCELADO', cliente_id: '24', barbero_id: '2', servicio_id: '3', nombreCliente: 'Emilio Rojas', nombreBarbero: 'Juan Rodríguez', nombreServicio: 'Degradado', precioServicio: 4500 },
  { turno_id: '32', fecha: '2026-07-01', hora_inicio: '14:00', hora_fin: '15:00', estado: 'ATENDIDO', cliente_id: '25', barbero_id: '4', servicio_id: '4', nombreCliente: 'Florencia Medina', nombreBarbero: 'Carlos Gómez', nombreServicio: 'Coloración', precioServicio: 8000 },
  { turno_id: '33', fecha: '2026-06-30', hora_inicio: '09:00', hora_fin: '09:45', estado: 'ATENDIDO', cliente_id: '1', barbero_id: '5', servicio_id: '5', nombreCliente: 'Carlos García', nombreBarbero: 'Andrés López', nombreServicio: 'Diseño', precioServicio: 6000 },
  { turno_id: '34', fecha: '2026-06-30', hora_inicio: '10:00', hora_fin: '10:30', estado: 'ATENDIDO', cliente_id: '2', barbero_id: '1', servicio_id: '6', nombreCliente: 'María López', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Afeitado', precioServicio: 2500 },
  { turno_id: '35', fecha: '2026-06-30', hora_inicio: '11:00', hora_fin: '11:30', estado: 'ATENDIDO', cliente_id: '10', barbero_id: '3', servicio_id: '1', nombreCliente: 'Martín Sánchez', nombreBarbero: 'Luis Fernández', nombreServicio: 'Corte Clásico', precioServicio: 3000 },
  { turno_id: '36', fecha: '2026-06-29', hora_inicio: '09:00', hora_fin: '09:45', estado: 'ATENDIDO', cliente_id: '11', barbero_id: '2', servicio_id: '2', nombreCliente: 'Ana Torres', nombreBarbero: 'Juan Rodríguez', nombreServicio: 'Corte + Barba', precioServicio: 5000 },
  { turno_id: '37', fecha: '2026-06-29', hora_inicio: '10:00', hora_fin: '10:40', estado: 'CANCELADO', cliente_id: '12', barbero_id: '4', servicio_id: '3', nombreCliente: 'Diego Ruiz', nombreBarbero: 'Carlos Gómez', nombreServicio: 'Degradado', precioServicio: 4500 },
  { turno_id: '38', fecha: '2026-06-29', hora_inicio: '14:00', hora_fin: '15:00', estado: 'ATENDIDO', cliente_id: '13', barbero_id: '5', servicio_id: '4', nombreCliente: 'Sofía Díaz', nombreBarbero: 'Andrés López', nombreServicio: 'Coloración', precioServicio: 8000 },
  { turno_id: '39', fecha: '2026-06-28', hora_inicio: '09:00', hora_fin: '09:45', estado: 'ATENDIDO', cliente_id: '14', barbero_id: '1', servicio_id: '5', nombreCliente: 'Mateo Romero', nombreBarbero: 'Pedro Martínez', nombreServicio: 'Diseño', precioServicio: 6000 },
  { turno_id: '40', fecha: '2026-06-28', hora_inicio: '10:00', hora_fin: '10:30', estado: 'ATENDIDO', cliente_id: '15', barbero_id: '3', servicio_id: '6', nombreCliente: 'Valentina Morales', nombreBarbero: 'Luis Fernández', nombreServicio: 'Afeitado', precioServicio: 2500 },
];

/** 30 pagos de prueba con distintos métodos y estados */
export const MOCK_PAGOS: Pago[] = [
  { pago_id: '1', turno_id: '4', monto_total: 8000, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-07-02', nombreCliente: 'Ana Torres', servicio: 'Coloración' },
  { pago_id: '2', turno_id: '11', monto_total: 5000, metodo_pago: 'TARJETA', estado_pago: 'APROBADO', fecha_pago: '2026-07-03', nombreCliente: 'Isabella Mendoza', servicio: 'Corte + Barba' },
  { pago_id: '3', turno_id: '12', monto_total: 4500, metodo_pago: 'QR', estado_pago: 'APROBADO', fecha_pago: '2026-07-03', nombreCliente: 'Tomás Silva', servicio: 'Degradado' },
  { pago_id: '4', turno_id: '14', monto_total: 6000, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-07-04', nombreCliente: 'Julieta Núñez', servicio: 'Diseño' },
  { pago_id: '5', turno_id: '15', monto_total: 2500, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-07-04', nombreCliente: 'Emilio Rojas', servicio: 'Afeitado' },
  { pago_id: '6', turno_id: '17', monto_total: 4500, metodo_pago: 'TRANSFERENCIA', estado_pago: 'APROBADO', fecha_pago: '2026-07-04', nombreCliente: 'Carlos García', servicio: 'Degradado' },
  { pago_id: '7', turno_id: '18', monto_total: 3000, metodo_pago: 'QR', estado_pago: 'APROBADO', fecha_pago: '2026-07-05', nombreCliente: 'María López', servicio: 'Corte Clásico' },
  { pago_id: '8', turno_id: '19', monto_total: 5000, metodo_pago: 'TARJETA', estado_pago: 'APROBADO', fecha_pago: '2026-07-05', nombreCliente: 'Martín Sánchez', servicio: 'Corte + Barba' },
  { pago_id: '9', turno_id: '20', monto_total: 4500, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-07-05', nombreCliente: 'Ana Torres', servicio: 'Degradado' },
  { pago_id: '10', turno_id: '21', monto_total: 8000, metodo_pago: 'TARJETA', estado_pago: 'APROBADO', fecha_pago: '2026-07-05', nombreCliente: 'Diego Ruiz', servicio: 'Coloración' },
  { pago_id: '11', turno_id: '22', monto_total: 6000, metodo_pago: 'QR', estado_pago: 'APROBADO', fecha_pago: '2026-07-06', nombreCliente: 'Sofía Díaz', servicio: 'Diseño' },
  { pago_id: '12', turno_id: '24', monto_total: 2500, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-07-06', nombreCliente: 'Valentina Morales', servicio: 'Afeitado' },
  { pago_id: '13', turno_id: '25', monto_total: 4500, metodo_pago: 'TARJETA', estado_pago: 'APROBADO', fecha_pago: '2026-07-07', nombreCliente: 'Nicolás Herrera', servicio: 'Degradado' },
  { pago_id: '14', turno_id: '26', monto_total: 5000, metodo_pago: 'QR', estado_pago: 'APROBADO', fecha_pago: '2026-07-07', nombreCliente: 'Camila Castro', servicio: 'Corte + Barba' },
  { pago_id: '15', turno_id: '29', monto_total: 3000, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-07-01', nombreCliente: 'Paula Reyes', servicio: 'Corte Clásico' },
  { pago_id: '16', turno_id: '30', monto_total: 5000, metodo_pago: 'TARJETA', estado_pago: 'APROBADO', fecha_pago: '2026-07-01', nombreCliente: 'Julieta Núñez', servicio: 'Corte + Barba' },
  { pago_id: '17', turno_id: '32', monto_total: 8000, metodo_pago: 'TRANSFERENCIA', estado_pago: 'APROBADO', fecha_pago: '2026-07-01', nombreCliente: 'Florencia Medina', servicio: 'Coloración' },
  { pago_id: '18', turno_id: '33', monto_total: 6000, metodo_pago: 'QR', estado_pago: 'APROBADO', fecha_pago: '2026-06-30', nombreCliente: 'Carlos García', servicio: 'Diseño' },
  { pago_id: '19', turno_id: '34', monto_total: 2500, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-06-30', nombreCliente: 'María López', servicio: 'Afeitado' },
  { pago_id: '20', turno_id: '35', monto_total: 3000, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-06-30', nombreCliente: 'Martín Sánchez', servicio: 'Corte Clásico' },
  { pago_id: '21', turno_id: '36', monto_total: 5000, metodo_pago: 'TARJETA', estado_pago: 'APROBADO', fecha_pago: '2026-06-29', nombreCliente: 'Ana Torres', servicio: 'Corte + Barba' },
  { pago_id: '22', turno_id: '38', monto_total: 8000, metodo_pago: 'EFECTIVO', estado_pago: 'APROBADO', fecha_pago: '2026-06-29', nombreCliente: 'Sofía Díaz', servicio: 'Coloración' },
  { pago_id: '23', turno_id: '39', monto_total: 6000, metodo_pago: 'QR', estado_pago: 'APROBADO', fecha_pago: '2026-06-28', nombreCliente: 'Mateo Romero', servicio: 'Diseño' },
  { pago_id: '24', turno_id: '40', monto_total: 2500, metodo_pago: 'TARJETA', estado_pago: 'APROBADO', fecha_pago: '2026-06-28', nombreCliente: 'Valentina Morales', servicio: 'Afeitado' },
  { pago_id: '25', turno_id: '1', monto_total: 3000, metodo_pago: 'EFECTIVO', estado_pago: 'PENDIENTE', fecha_pago: '2026-07-02', nombreCliente: 'Carlos García', servicio: 'Corte Clásico' },
  { pago_id: '26', turno_id: '5', monto_total: 6000, metodo_pago: 'QR', estado_pago: 'PENDIENTE', fecha_pago: '2026-07-02', nombreCliente: 'Diego Ruiz', servicio: 'Diseño' },
  { pago_id: '27', turno_id: '8', monto_total: 5000, metodo_pago: 'TARJETA', estado_pago: 'PENDIENTE', fecha_pago: '2026-07-02', nombreCliente: 'Valentina Morales', servicio: 'Corte + Barba' },
  { pago_id: '28', turno_id: '27', monto_total: 8000, metodo_pago: 'TARJETA', estado_pago: 'RECHAZADO', fecha_pago: '2026-07-07', nombreCliente: 'Isabella Mendoza', servicio: 'Coloración' },
  { pago_id: '29', turno_id: '3', monto_total: 4500, metodo_pago: 'QR', estado_pago: 'RECHAZADO', fecha_pago: '2026-07-02', nombreCliente: 'Martín Sánchez', servicio: 'Degradado' },
  { pago_id: '30', turno_id: '9', monto_total: 4500, metodo_pago: 'TRANSFERENCIA', estado_pago: 'PENDIENTE', fecha_pago: '2026-07-03', nombreCliente: 'Nicolás Herrera', servicio: 'Degradado' },
];
