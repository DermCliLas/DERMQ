# Reporte de Arquitectura y Requerimientos: DERMQ

A continuación, presento un informe detallado sobre el estado actual, arquitectura y los requerimientos identificados del proyecto **DERMQ - Clínica Dermatológica de Vanguardia**.

## 1. Arquitectura del Proyecto

El proyecto está diseñado bajo una arquitectura de cliente-servidor separada (Frontend desacoplado del Backend).

### 1.1. Frontend (Cliente)
El frontend actualmente está construido con una arquitectura "Vanilla+" enfocada en un altísimo rendimiento y un diseño estético *premium*.

*   **Tecnologías Base:** HTML5 semántico, JavaScript estándar y CSS3 avanzado.
*   **Gestor de Estilos:** Tailwind CSS (cargado vía CDN con configuración extendida mediante scripts en el `Head`). Se utilizan plugins de Tailwind como `forms` y `container-queries`.
*   **Sistema de Diseño:** Alto uso de *Glassmorphism* (tarjetas de cristal, desenfoques), animaciones sutiles (micro-interacciones, revelado de texto, flotación), y personalización de *Design Tokens* basados en la paleta de colores corporativa (tonos esmeralda, teal, blanco roto y oscuros profundos).
*   **Tipografía e Iconografía:** Google Fonts (`Inter` y `Manrope`) junto con Material Symbols Outlined.
*   **Páginas Principales:**
    *   `index.html` (Landing page con animaciones y secciones dinámicas).
    *   `nosotros.html`, `servicios.html`, `portafolio.html`, `productos.html`, `contacto.html`.
    *   Flujo de reservas multi-paso: `reservar.html`, `reservar-paso2.html`, `reservar-paso3.html`, `reservar-paso4.html`.
    *   `carrito.html` y `dashboard.html` (para administración o perfil del paciente).

### 1.2. Backend (Servidor)
El backend está estructurado sobre un ecosistema Node.js robusto, tipado y escalable.

*   **Framework Core:** NestJS (v11) bajo el patrón de inyección de dependencias y controladores modulares.
*   **Lenguaje:** TypeScript fluido con configuración estricta.
*   **Calidad de Código y Estilo:** Configurado con ESLint, Prettier y Jest para testing (unitario y de integración e2e).

### 1.3. Base de Datos y ORM
Gestión de datos completamente modelada y relacional.

*   **ORM:** Prisma Client (v7.7.0). Actúa como la capa de acceso a los datos, brindando tipado seguro desde la base de datos hasta los servicios.
*   **Motor de Base de Datos:** PostgreSQL (indicado por el `provider = "postgresql"` dentro del esquema de Prisma).

---

## 2. Modelado de Datos (Esquema de Base de Datos)
El esquema Prisma revela los módulos centrales y relaciones del negocio:

*   **Módulo de Usuarios (`User`):** Sistema basado en roles (`ADMIN`, `RECEPTION`, `DOCTOR`, `PATIENT`). Los doctores tienen meta-datos adicionales (especialidad, avatar, token de sincronización en la nube).
*   **Módulo de Catálogo Clínico (`Category`, `Service`):** Agrupa y define los servicios médicos-estéticos, con duraciones, precios y estados de activación.
*   **Módulo de Inventario y Tienda (`Product`):** Gestión de SKU (con soporte para lector POS), stock base, precios y visibilidad activa.
*   **Módulo de Citas (`Appointment`):** El corazón de las reservas. Relaciona un paciente con un doctor y un servicio. Maneja estados (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), y enlaza con facturación y eventos externos de calendario.
*   **Módulo de Facturación y Pagos (`Order`, `OrderItem`):** 
    *   Soporta compras desde la web (`WEB`) y desde la clínica (`POS`).
    *   Tipos de pago integrados: Credit Card (Pasarela local), Cash, Yape, Plin y Transferencias bancarias.
    *   Tipos de documentos: Boletas, Facturas y Tickets.

---

## 3. Requerimientos Funcionales e Integraciones Clave

Basado en el contexto tecnológico del repositorio, el proyecto exige cumplir estos requerimientos core de negocio:

### 3.1. Experiencia de Usuario (UI/UX)
*   **Estándar "Premium":** Todas las interfaces, incluyendo los flujos transaccionales (reservas, dashboards y visuales médicos), deben sentirse sofisticados, rápidos y altamente interactivos. Esto implica no usar tablas aburridas ni botones estándar genéricos, sino preservar la animación y la coherencia visual que ya tiene el Landing.

### 3.2. Motor de Reservas Inteligente (Flujo Multi-Paso)
*   La lógica frontend (separada en 4 pasos HTML) consumirá endpoints del backend para obtener doctores disponibles, horarios, confirmación de validación de usuario y agendamiento persistente.
*   **Integración:** Conexión bidireccional mediante el `googleEventId` y `googleSyncToken` contemplada en Base de datos para asegurar que cuando el paciente separe en la web, se refleje en Google Calendar y vice versa.

### 3.3. Sistema Omnicanal de Ventas y ERP (Punto de Venta + Web)
*   Debe soportar flujos de ventas físicos en recepción y compras remotas a través del "Shop" y carrito de la web de productos (`OrderSource.WEB` vs `OrderSource.POS`).
*   **Gestión de Inventarios Especializados:** El sistema (como se discutió en el historial clínico del proyecto) debe manejar familias de productos (MP, PI, ME, PT), lotes y control de fecha de caducidad.

### 3.4. Facturación Electrónica Nacional (Perú)
*   Existen vínculos fuertes en el esquema a la integración con **NubeFact** (`nubeFactId`, `nubeFactPdfUrl`, `nubeFactXmlUrl`), dictando el requerimiento de emitir recibos electrónicos legales una vez la cita o compra en POS esté pagada.

### 3.5. Autenticación y Autorización
*   Roles completamente separados para el acceso al dashboard administrativo. El `dashboard.html` debe cambiar condicionalmente sus gráficos o acceso de recepción de mesón en base a si el usuario autenticado es `ADMIN` vs `RECEPTION` vs `DOCTOR`.

---
> [!TIP]
> **Pasos Siguientes sugeridos:**
> - Integrar el framework de Frontend (React/Vue o Next.js/Nuxt) si requieres manejar estados complejos fácilmente para el flujo de reserva, o continuar con Vanilla JS implementando un patrón sólido de State Management en el Frontend.
> - Ejecutar migraciones de Prisma en base de datos.
> - Desarrollar los controladores de NestJS para las reservas o autenticación de usuarios.
