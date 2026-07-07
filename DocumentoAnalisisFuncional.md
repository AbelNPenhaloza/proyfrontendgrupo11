# 📋 Documento de Análisis Funcional

**Barbería Alto Corte — Sistema de Turnos Online**

| Campo | Detalle |
|---|---|
| Universidad | Universidad Nacional de Jujuy |
| Facultad | Facultad de Ingeniería |
| Cátedra | Programación y Servicios Web |
| Proyecto | Barbería Alto Corte — Sistema de Turnos Online |
| Grupo | Grupo 11 |
| Fecha | Julio de 2026 |

## 👥 Integrantes del equipo de desarrollo

| Integrante | Rol en el proyecto | Área principal |
|---|---|---|
| Abel Peñaloza | Desarrollo Frontend | Autenticación, registro y perfil de usuario (Angular) |
| Luca Suilice | Desarrollo Frontend | Catálogo de servicios y calendario de disponibilidad |
| Jeremias Morales | Desarrollo Frontend | Flujo de reserva de turno, historial e integración de pagos |
| Jeremías Morales | Desarrollo Backend | API REST (Express/Sequelize), autenticación JWT, turnos y disponibilidad |
| Sergio Gutierrez | Backend / Panel Admin | Panel administrativo, dashboard, integraciones (Calendar, Mail, MercadoPago) |

---
## 1. Introducción

El presente documento constituye el Análisis Funcional del Trabajo Final Integrador de la cátedra Programación y Servicios Web, correspondiente al Grupo 11. Su objetivo es describir, desde la perspectiva del analista funcional, el problema de negocio abordado, el alcance del sistema, los actores involucrados, los requerimientos funcionales y no funcionales, las reglas de negocio y los casos de uso que rigen el comportamiento esperado de la aplicación.

El sistema desarrollado, denominado **"Barbería Alto Corte"**, digitaliza la gestión de turnos de una barbería, reemplazando la coordinación telefónica o presencial por una plataforma web con roles diferenciados, disponibilidad en tiempo real, notificaciones automáticas y medios de pago electrónicos.

> 📌 **Nota metodológica:** Este documento se elabora en paralelo al desarrollo del sistema (metodología iterativa), por lo que refleja tanto los requerimientos originalmente relevados en la propuesta de proyecto como el estado real de la implementación al momento de esta entrega.

---

## 2. Objetivos

### 2.1 Objetivo general

Diseñar e implementar un sistema web integral para la gestión de turnos de una barbería, que permita a los clientes reservar servicios en línea y a los profesionales y administradores gestionar su agenda, aplicando buenas prácticas de arquitectura, seguridad y consumo de servicios externos.

### 2.2 Objetivos específicos

- Eliminar la dependencia de la reserva telefónica de turnos.
- Reducir el ausentismo mediante recordatorios y confirmaciones automáticas por correo electrónico.
- Brindar visibilidad en tiempo real de la disponibilidad horaria de cada barbero.
- Permitir el pago anticipado de servicios mediante una pasarela de pago electrónica.
- Proveer a la administración un panel de control con métricas de gestión (turnos, ingresos, ocupación).
- Registrar de forma auditable las acciones críticas realizadas sobre el sistema.

---

## 3. Alcance del Sistema

### 3.1 Incluido en el alcance

- Registro, autenticación (local y Google OAuth 2.0) y gestión de perfil de usuarios.
- Administración de barberos, especialidades y disponibilidad horaria semanal.
- Catálogo de servicios (nombre, descripción, precio, duración).
- Reserva, cancelación y seguimiento de turnos, con cálculo automático de horarios libres.
- Notificaciones automáticas por correo (confirmación con código QR, cancelación).
- Sincronización de turnos confirmados con Google Calendar del profesional.
- Pago anticipado del turno mediante MercadoPago.
- Panel administrativo con indicadores, gráficos estadísticos, listados con DataTables y exportación a PDF/Excel.
- Auditoría de acciones sensibles (login, logout, creación y cancelación de turnos).

### 3.2 Fuera del alcance (versión actual)

- Aplicaciones móviles nativas (se prioriza diseño web responsivo).
- Facturación electrónica ante organismos fiscales.
- Gestión de stock de insumos o productos de venta.
- Programa de fidelización o puntos para clientes recurrentes.

---

## 4. Actores y Roles del Sistema

El sistema define cuatro roles con permisos diferenciados, controlados mediante autorización basada en roles (RBAC) sobre los endpoints de la API.

| Rol | Descripción | Responsabilidades principales |
|---|---|---|
| **Cliente** | Usuario final que solicita servicios de la barbería | Registrarse, iniciar sesión (local o Google), ver disponibilidad, reservar y cancelar turnos, pagar en línea, ver su historial |
| **Barbero** | Profesional que presta el servicio | Ver su agenda diaria, marcar turnos como atendidos, configurar su disponibilidad semanal |
| **Recepcionista** | Personal administrativo del local | Reservar turnos en nombre de clientes, gestionar la agenda general |
| **Administrador** | Responsable de la operación del sistema | ABM de usuarios, barberos y servicios; visualización del panel de métricas; gestión integral de turnos y pagos |

---

## 5. Relevamiento de Requerimientos

### 5.1 Requerimientos Funcionales (RF)

Los requerimientos funcionales se agrupan por módulo, siguiendo la misma organización utilizada en el diseño de la arquitectura del sistema (ver Documento de Arquitectura de Software).

#### 🔐 Módulo de Autenticación y Seguridad

| ID | Requerimiento |
|---|---|
| RF-01 | El sistema debe permitir el registro de nuevos clientes con email y contraseña. |
| RF-02 | El sistema debe permitir iniciar sesión mediante credenciales locales o mediante cuenta de Google (OAuth 2.0). |
| RF-03 | El sistema debe emitir un token JWT que identifique al usuario y su rol en cada sesión. |
| RF-04 | El sistema debe restringir el acceso a cada endpoint según el rol del usuario autenticado. |
| RF-05 | El sistema debe registrar en una bitácora de auditoría los inicios de sesión, cierres de sesión, creación y cancelación de turnos. |

#### ✂️ Módulo de Servicios

| ID | Requerimiento |
|---|---|
| RF-06 | El sistema debe permitir al administrador crear, modificar, activar y desactivar servicios. |
| RF-07 | Cada servicio debe contar con nombre, descripción, precio, duración estimada e imagen. |
| RF-08 | El sistema debe permitir asociar una o más especialidades a cada barbero (clásico, barba, colorista, degradados). |

#### 📅 Módulo de Disponibilidad y Agenda

| ID | Requerimiento |
|---|---|
| RF-09 | El sistema debe permitir configurar la disponibilidad horaria de cada barbero por día de la semana. |
| RF-10 | El sistema debe calcular automáticamente los horarios libres según la duración del servicio elegido y los turnos ya reservados. |
| RF-11 | El barbero debe poder visualizar su agenda diaria. |

#### 🗓️ Módulo de Turnos

| ID | Requerimiento |
|---|---|
| RF-12 | El cliente debe poder seleccionar servicio, barbero, fecha y horario disponible para reservar un turno. |
| RF-13 | El sistema debe enviar un correo de confirmación con el detalle del turno y un código QR asociado. |
| RF-14 | El cliente debe poder cancelar su turno; el sistema debe notificar la cancelación por correo. |
| RF-15 | El sistema debe reflejar el estado del turno en todo momento: pendiente, confirmado, atendido o cancelado. |
| RF-16 | Al confirmarse un turno, el sistema debe crear automáticamente un evento en el Google Calendar del barbero, e invitar al cliente. |

#### 💳 Módulo de Pagos

| ID | Requerimiento |
|---|---|
| RF-17 | El sistema debe permitir generar un link de pago (checkout) para abonar el turno de forma anticipada. |
| RF-18 | El sistema debe registrar el estado del pago (pendiente, aprobado, rechazado, cancelado, reembolsado) asociado al turno. |

#### 📊 Panel Administrativo

| ID | Requerimiento |
|---|---|
| RF-19 | El sistema debe presentar indicadores clave (KPI) de turnos, ingresos y ocupación por barbero. |
| RF-20 | El sistema debe presentar gráficos de barra, torta y línea sobre la operación de la barbería. |
| RF-21 | El sistema debe listar entidades (usuarios, turnos, pagos) en tablas con filtro, búsqueda y paginación. |
| RF-22 | El sistema debe permitir exportar reportes a formato PDF y Excel. |

### 5.2 Requerimientos No Funcionales (RNF)

| ID | Categoría | Descripción |
|---|---|---|
| RNF-01 | Seguridad | Las contraseñas deben almacenarse hasheadas (bcrypt); las sesiones se manejan mediante JWT firmado con expiración. |
| RNF-02 | Seguridad | Validación de datos de entrada en el servidor (express-validator) para prevenir inyección y XSS; uso de cabeceras seguras (helmet) y CORS controlado. |
| RNF-03 | Usabilidad | La interfaz debe ser responsiva y utilizable desde dispositivos móviles (mobile-first). |
| RNF-04 | Disponibilidad | El sistema debe operar de forma independiente para cada rol, sin bloqueos cruzados entre módulos. |
| RNF-05 | Mantenibilidad | El backend debe seguir el patrón MVC con separación estricta de capas para facilitar el mantenimiento evolutivo. |
| RNF-06 | Trazabilidad | Toda acción sensible debe quedar registrada con usuario, fecha, IP de origen y tipo de acción. |
| RNF-07 | Interoperabilidad | El sistema debe integrarse con al menos cuatro servicios web externos (requisito de cátedra). |

---

## 6. Casos de Uso Principales

### 6.1 Listado general por actor

| Actor | Casos de uso |
|---|---|
| Cliente | Registrarse / Iniciar sesión (local o Google) · Ver catálogo de servicios · Consultar disponibilidad · Reservar turno · Pagar turno · Cancelar turno · Ver historial de turnos y pagos |
| Barbero | Iniciar sesión · Ver agenda diaria · Marcar turno como atendido · Configurar disponibilidad semanal |
| Recepcionista | Reservar turno en nombre de un cliente · Consultar agenda general |
| Administrador | Gestionar usuarios · Gestionar barberos y especialidades · Gestionar servicios · Ver dashboard y métricas · Exportar reportes · Auditar acciones |

### 6.2 CU-01: Reservar Turno

| Campo | Detalle |
|---|---|
| Actor principal | Cliente |
| Precondición | El cliente debe estar autenticado. |
| Flujo principal | 1) El cliente selecciona un servicio. 2) El sistema muestra los barberos habilitados para ese servicio. 3) El cliente elige fecha y el sistema calcula los horarios disponibles según la disponibilidad del barbero y los turnos ya ocupados. 4) El cliente selecciona un horario y confirma. 5) El sistema crea el turno en estado "pendiente/confirmado", envía un correo con código QR y, si corresponde, genera el evento en Google Calendar del barbero. |
| Flujos alternativos | Si no hay horarios disponibles, el sistema informa la falta de disponibilidad. Si el cliente opta por pago anticipado, se deriva al CU-03. |
| Postcondición | El turno queda registrado con estado "confirmado" y visible en la agenda del barbero. |

### 6.3 CU-02: Gestionar Disponibilidad

| Campo | Detalle |
|---|---|
| Actor principal | Barbero / Administrador |
| Precondición | El barbero debe tener un perfil activo en el sistema. |
| Flujo principal | 1) El barbero define, para cada día de la semana, su horario de inicio y fin de atención. 2) El sistema almacena esta configuración y la utiliza como base para el cálculo de franjas libres en cada reserva. |
| Postcondición | La disponibilidad queda actualizada y disponible para el módulo de turnos. |

### 6.4 CU-03: Pagar Turno en Línea

| Campo | Detalle |
|---|---|
| Actor principal | Cliente |
| Precondición | Existe un turno creado en estado pendiente de pago. |
| Flujo principal | 1) El cliente solicita pagar el turno. 2) El sistema genera una preferencia de pago en MercadoPago con el detalle del servicio y monto. 3) El cliente completa el pago en el checkout externo. 4) MercadoPago notifica el resultado y el sistema actualiza el estado del pago (aprobado, rechazado o pendiente). |
| Postcondición | El pago queda vinculado al turno con su estado final. |

---

## 7. Reglas de Negocio

- Un turno solo puede reservarse dentro de un horario en el que el barbero tenga disponibilidad configurada para ese día de la semana.
- No pueden existir dos turnos superpuestos para el mismo barbero en la misma franja horaria.
- La franja horaria ofrecida al cliente se calcula en función de la duración del servicio elegido (por ejemplo, un servicio de 45 minutos solo puede iniciar en horarios que dejen un bloque completo libre).
- Un turno puede transicionar únicamente entre los estados: pendiente → confirmado → atendido, o bien a cancelado desde pendiente o confirmado.
- Todo cambio de estado relevante (creación o cancelación de turno, inicio y cierre de sesión) debe generar un registro de auditoría.
- El rol del usuario determina de forma exclusiva las operaciones habilitadas; un cliente no puede acceder a operaciones de administración ni de agenda de barberos.

---

## 8. Modelo de Datos Conceptual

El modelo de datos fue diseñado en conjunto con la cátedra y se representa mediante un diagrama de clases UML, que constituye la base del modelo relacional implementado en PostgreSQL a través de Sequelize (ver Documento de Arquitectura de Software para el detalle técnico).

> 🖼️ **Referencia:** Adjuntar el diagrama de clases UML del dominio (Usuario, Barbero, Disponibilidad, Servicio, Turno, Pago, AuditoriaLog y sus enumeraciones) como imagen dentro de esta página de Notion.

### 8.1 Entidades principales

| Entidad | Propósito en el dominio |
|---|---|
| Usuario | Representa a toda persona que interactúa con el sistema (cliente, barbero, recepcionista o administrador), con su rol asociado. |
| Barbero | Perfil profesional vinculado a un usuario; define especialidad y estado activo. |
| Disponibilidad | Horario habitual de atención de un barbero para cada día de la semana. |
| Servicio | Prestación ofrecida por la barbería (nombre, duración, precio). |
| Turno | Reserva concreta que vincula cliente, barbero, servicio, fecha, horario y estado. |
| Pago | Registro del intento/resultado de pago asociado a un turno. |
| AuditoriaLog | Registro histórico de acciones relevantes ejecutadas por los usuarios. |

---

## 9. Matriz de Trazabilidad: Requerimientos vs. Estado de Implementación

| Módulo | Estado | Observaciones |
|---|---|---|
| Autenticación y Seguridad (RF-01 a RF-05) | ✅ Implementado | JWT, bcrypt, Google OAuth 2.0 (Passport.js) y auditoría operativos. |
| Servicios (RF-06 a RF-08) | ✅ Implementado | CRUD de servicios y especialidades de barbero funcional. |
| Disponibilidad y Agenda (RF-09 a RF-11) | ✅ Implementado | Algoritmo de cálculo de franjas horarias disponible como función pura y testeable. |
| Turnos (RF-12 a RF-16) | ✅ Implementado | Incluye envío de correo con QR y sincronización con Google Calendar. |
| Pagos (RF-17, RF-18) | ✅ Implementado | Generación de preferencia de pago con MercadoPago; falta validar el webhook de confirmación en producción. |
| Panel Administrativo (RF-19 a RF-22) | ✅ Implementado | Dashboard con Chart.js, tablas con DataTables, exportación a PDF (jsPDF) y Excel (SheetJS). |
| Documentación de API (Swagger) | 🟡 Pendiente | Próxima etapa antes de la defensa. |
| Despliegue en Render | 🟡 Pendiente | Próxima etapa antes de la defensa. |

---

## 10. Criterios de Aceptación y Plan de Pruebas Funcional

Se definen criterios de aceptación de alto nivel para los flujos críticos, a validar mediante pruebas manuales con Postman y pruebas de interfaz antes de la defensa.

| Flujo | Criterio de aceptación |
|---|---|
| Reserva de turno | Un cliente autenticado puede reservar un turno en un horario disponible y recibe un correo de confirmación con código QR en menos de 1 minuto. |
| Cancelación de turno | Al cancelar un turno, su estado cambia a "cancelado", se libera el horario y el cliente recibe notificación por correo. |
| Cálculo de disponibilidad | El sistema nunca ofrece un horario que se superponga con un turno ya confirmado del mismo barbero. |
| Control de roles | Un usuario con rol Cliente recibe error 403 al intentar acceder a un endpoint exclusivo de Administrador. |
| Pago en línea | El estado del turno y del pago se actualiza correctamente ante una respuesta aprobada de MercadoPago. |
| Auditoría | Cada login, logout, creación y cancelación de turno genera un registro en AuditoriaLog con fecha e IP de origen. |

---

## 11. Conclusiones y Próximos Pasos

El relevamiento funcional confirma que el sistema, en su estado actual, cubre la totalidad de los requerimientos funcionales definidos en la etapa de diseño, incluyendo los cuatro módulos exigidos por la cátedra (seguridad, servicios, agenda, turnos, pagos y panel administrativo). Los aspectos pendientes para la entrega final son de carácter técnico-documental y de despliegue, y no impactan sobre el modelo funcional aprobado.

### ✅ Próximos pasos

- [ ] Completar la documentación de la API con Swagger.
- [ ] Publicar el backend y el frontend en Render para la defensa del proyecto.
- [ ] Ejecutar la ronda final de pruebas funcionales end-to-end sobre ambiente productivo.
- [ ] Preparar el guion de demostración en vivo para la defensa grupal.