# Barbería Alto Corte — Frontend

Aplicación web (SPA) desarrollada en **Angular** para el sistema de gestión de turnos de **Barbería Alto Corte**, Trabajo Final Integrador de la cátedra **Programación y Servicios Web** — Facultad de Ingeniería, Universidad Nacional de Jujuy (Grupo 11).

Consume la [API REST del backend](../proybackendgrupo11) y ofrece experiencias diferenciadas para tres roles: **Cliente**, **Barbero** y **Administrador**, incluyendo login social con Google, reserva de turnos con calendario de disponibilidad, pago en línea con MercadoPago, un panel administrativo con gráficos y exportación de reportes, y un recomendador de cortes asistido por IA.

## Índice

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración de entornos](#configuración-de-entornos)
- [Scripts disponibles](#scripts-disponibles)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Autenticación y guards](#autenticación-y-guards)
- [Servicios principales](#servicios-principales)
- [Identidad visual](#identidad-visual)
- [Estado del proyecto](#estado-del-proyecto)

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Angular (componentes standalone, lazy loading por ruta) |
| Estilos | Bootstrap 5 + Bootstrap Icons, estilos propios de marca |
| Gráficos | Chart.js |
| Tablas | DataTables.net (con jQuery) |
| Exportación PDF | jsPDF |
| Exportación Excel | SheetJS (xlsx) |
| HTTP | HttpClient con interceptor de autenticación |
| Tipado | TypeScript |

## Estructura del proyecto

```
proyfrontendgrupo11/
├── public/
│   └── assets/ia/               # Imágenes usadas por el recomendador de cortes
├── src/
│   ├── environments/
│   │   ├── environment.ts        # Configuración de desarrollo
│   │   └── environment.prod.ts   # Configuración de producción
│   ├── app/
│   │   ├── app.routes.ts         # Definición de rutas y lazy loading
│   │   ├── app.config.ts         # Providers (HttpClient, interceptor, router)
│   │   ├── components/
│   │   │   ├── admin/            # Dashboard, tablas y formularios ABM (turnos, pagos, usuarios, barberos, servicios, auditoría)
│   │   │   ├── barbero/          # Dashboard, agenda, disponibilidad y perfil del barbero
│   │   │   ├── cliente/recomendacion-ia/   # Recomendador de cortes con IA
│   │   │   ├── calendario-turnos/          # Calendario de disponibilidad y reserva
│   │   │   ├── catalogo-servicios/         # Catálogo de servicios de la barbería
│   │   │   ├── formulario-inscripcion/     # Registro de nuevos clientes
│   │   │   ├── google-callback/            # Callback del login con Google
│   │   │   ├── home/, login/, pago/, perfil/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts     # Bloquea rutas a usuarios no autenticados
│   │   │   └── role.guard.ts     # Restricción por rol (pendiente de implementación)
│   │   ├── models/                # Interfaces TypeScript (usuario, barbero, servicio, turno, pago, auth)
│   │   ├── services/
│   │   │   ├── auth/auth.service.ts, auth.interceptor.ts
│   │   │   ├── barbero.service.ts, servicio.service.ts, turno.service.ts, pago.service.ts, usuario.service.ts
│   │   │   ├── dashboard.service.ts, export.service.ts, auditoria.service.ts
│   │   └── shared/
│   │       ├── navbar-admin/, navbar-barbero/, navbar-cliente/   # Navegación específica por rol
│   ├── assets/fonts/              # Tipografía de marca (BarbersHand)
│   └── styles.css                 # Variables de marca y estilos globales
├── angular.json
├── package.json
└── README.md
```

## Requisitos previos

- **Node.js** 18 o superior
- **Angular CLI** instalado globalmente (`npm install -g @angular/cli`) o disponible vía `npx`
- El [backend del proyecto](../proybackendgrupo11) corriendo localmente (por defecto en `http://localhost:3000`)

## Instalación

```bash
# 1. Clonar el repositorio
git clone <https://github.com/AbelNPenhaloza/proyfrontendgrupo11>
cd proyfrontendgrupo11

# 2. Instalar dependencias
npm install

# 3. Verificar la URL del backend en src/environments/environment.ts (ver siguiente sección)

# 4. Levantar el servidor de desarrollo
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

## Configuración de entornos

El frontend define la URL base de la API mediante `environment.API_BASE_URL`, reemplazada automáticamente por Angular según el modo de build.

**`src/environments/environment.ts`** (desarrollo):
```ts
export const environment = {
  production: false,
  API_BASE_URL: 'http://localhost:3000/api'
};
```

**`src/environments/environment.prod.ts`** (producción):
```ts
export const environment = {
  production: true,
  API_BASE_URL: '/api'
};
```

> En producción se asume que el frontend y el backend se sirven bajo el mismo dominio (por eso `API_BASE_URL: '/api'`); si el backend se despliega en una URL distinta, actualizar este valor antes de compilar.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Levanta el servidor de desarrollo (`ng serve`) en `http://localhost:4200` |
| `npm run build` | Compila la aplicación para producción en `dist/frontend` |
| `npm run watch` | Compila en modo desarrollo con recompilación continua |
| `npm test` | Ejecuta las pruebas unitarias configuradas |

## Rutas de la aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/login` | Login | Público |
| `/formulario` | Registro de cliente | Público |
| `/auth/google` | Callback de login con Google | Público |
| `/pago/exitoso`, `/pago/fallido`, `/pago/pendiente` | Resultado del pago (MercadoPago) | Público |
| `/home` | Home | Autenticado |
| `/perfil` | Perfil del usuario | Autenticado |
| `/cliente/turnos` | Calendario y reserva de turnos | Autenticado |
| `/cliente/ia` | Recomendador de cortes con IA | Autenticado |
| `/admin/dashboard` | Panel de métricas | Autenticado |
| `/admin/turnos`, `/admin/turnos/crear`, `/admin/turnos/editar/:id` | Gestión de turnos | Autenticado |
| `/admin/pagos` | Gestión de pagos | Autenticado |
| `/admin/usuarios`, `/admin/usuarios/crear`, `/admin/usuarios/editar/:id` | Gestión de usuarios | Autenticado |
| `/admin/barberos`, `/admin/barberos/crear`, `/admin/barberos/editar/:id` | Gestión de barberos | Autenticado |
| `/admin/servicios`, `/admin/servicios/crear`, `/admin/servicios/editar/:id` | Gestión de servicios | Autenticado |
| `/admin/auditoria` | Registro de auditoría | Autenticado |
| `/barbero/dashboard` | Panel del barbero | Autenticado |
| `/barbero/agenda` | Agenda diaria del barbero | Autenticado |
| `/barbero/disponibilidad` | Configuración de disponibilidad | Autenticado |
| `/barbero/perfil` | Perfil del barbero | Autenticado |

Todas las rutas del frontend son lazy-loaded mediante `loadComponent`, salvo `barbero/perfil`.

## Autenticación y guards

- El token JWT emitido por el backend se gestiona desde `auth.service.ts` y se adjunta automáticamente a cada request saliente mediante `auth.interceptor.ts`, registrado en `app.config.ts` con `provideHttpClient(withInterceptors([authInterceptor]))`.
- `auth.guard.ts` protege todas las rutas que requieren sesión iniciada (`home`, `perfil`, `admin/*`, `barbero/*`, `cliente/*`).
- `role.guard.ts` existe como archivo pero **aún no tiene lógica implementada**: actualmente la restricción de acceso por rol específico (por ejemplo, evitar que un Cliente acceda a `/admin`) depende de la respuesta 403 del backend y de la navegación condicional en los componentes de navbar, no de un guard dedicado. Se recomienda completar este guard antes de la defensa.
- El login social redirige a `/auth/google`, donde `google-callback` procesa el token recibido del backend tras el flujo OAuth.

## Servicios principales

| Servicio | Responsabilidad |
|---|---|
| `auth.service.ts` | Login local, login con Google, registro, logout, manejo de sesión |
| `usuario.service.ts` | CRUD de usuarios y perfil propio |
| `barbero.service.ts` / `barbero-panel.service.ts` | CRUD de barberos, disponibilidad y datos del panel del barbero |
| `servicio.service.ts` | CRUD del catálogo de servicios |
| `turno.service.ts` | Consulta de disponibilidad, reserva, cancelación y cambio de estado de turnos |
| `pago.service.ts` | Generación de preferencia de pago y confirmación con MercadoPago |
| `dashboard.service.ts` | Métricas e indicadores del panel administrativo |
| `export.service.ts` | Exportación de listados a PDF (jsPDF) y Excel (SheetJS) |
| `auditoria.service.ts` | Consulta del registro de auditoría |

## Identidad visual

La aplicación sigue un manual de marca propio, definido en `src/styles.css`:

| Elemento | Valor |
|---|---|
| Color primario | `#A8201A` (Rojo Tradición) |
| Color secundario | `#14213D` (Azul Moderno) |
| Fondo | `#F4F1DE` (Crema Suave) |
| Acento | `#5C3D2E` (Marrón Barbería) |
| Tipografía de títulos | Rye / Cinzel |
| Tipografía de texto | Montserrat / Inter |

## Estado del proyecto

- [x] Estructura de componentes standalone con lazy loading
- [x] Login local y con Google OAuth
- [x] Calendario de disponibilidad y reserva de turnos
- [x] Pago en línea con MercadoPago (páginas de resultado)
- [x] Panel administrativo con Chart.js, DataTables, exportación a PDF y Excel
- [x] Panel y agenda del barbero
- [x] Recomendador de cortes con IA
- [ ] Implementar la lógica de `role.guard.ts` para restricción de rutas por rol
- [ ] Configurar `API_BASE_URL` de producción según la URL final del backend en Render
- [ ] Pruebas end-to-end del flujo completo antes de la defensa

---

**Grupo 11** — Programación y Servicios Web — Facultad de Ingeniería, UNJu — 2026