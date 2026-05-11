# FixIt - Marketplace de Servicios a Domicilio

**FixIt** es una plataforma tipo "Uber para servicios" diseñada para conectar usuarios con técnicos especializados (reparación de electrodomésticos, plomería, electricidad, etc.) de manera rápida y segura. El enfoque principal está en la fricción cero, presupuestos flash y pagos seguros mediante Escrow.

Este proyecto es un Prototipo (MVP) desarrollado con **React**, **Tailwind CSS** y **Lucide React**.

---

## 🚀 Funcionalidades Actuales Disponibles

Actualmente, el MVP cuenta con las siguientes vistas y flujos funcionales (basados en datos simulados/mockups para la interfaz):

### 1. Landing Page (`/`)
La puerta de entrada a la plataforma. Diseñada para generar confianza y guiar al usuario a la acción principal.
*   **Buscador Principal:** Permite ingresar el problema (ej: "Mi nevera no enfría") y una ubicación.
*   **Sección de Beneficios:** Explica el valor de la plataforma (Presupuesto Flash, Pagos Protegidos, Técnicos Verificados).
*   **Categorías Populares:** Navegación rápida por los servicios más demandados.
*   **Llamado a la Acción (CTA):** Botones estratégicos que dirigen al flujo de búsqueda.

### 2. Resultados de Búsqueda y Mapa (`/search`)
Muestra los técnicos disponibles cerca del usuario en base a su búsqueda.
*   **Listado de Técnicos:** Tarjetas de técnicos con foto, calificación, distancia y descripción breve.
*   **Navegación al Perfil:** Al hacer clic en el nombre o foto del técnico, redirige a su perfil completo.
*   **Presupuesto Flash:** Botón en cada tarjeta que abre un modal para enviar una solicitud rápida al técnico sin compromiso.
*   **Visualización de Mapa:** Panel interactivo (simulado) que muestra un "Mapa de Confianza" con la ubicación aproximada de los técnicos.

### 3. Perfil del Técnico (`/technician/:id`)
Página de detalle extendido para cada profesional.
*   **Información Extendida:** Especialidades, verificación de identidad y años de experiencia.
*   **Estadísticas de Rendimiento:** Número de trabajos, tasa de puntualidad y tiempo promedio de respuesta.
*   **Mapa de Calor de Disponibilidad:** Gráfico visual rápido que muestra los días de la semana con mayor actividad o disponibilidad del técnico.
*   **Reseñas Completas:** Historial detallado de opiniones de clientes previos.

### 4. Dashboard del Cliente (`/dashboard/client`)
El panel de control donde el usuario gestiona sus solicitudes y pagos.
*   **Estado de Solicitudes:** Línea de tiempo visual (Progress Bar) que muestra en qué etapa se encuentra el servicio (Asignado, En Camino, Finalizado).
*   **Billetera de Seguridad (Escrow):** Muestra el dinero que el cliente ha depositado y que actualmente está *retenido*. El dinero solo se libera al técnico cuando el cliente presiona "Liberar Pago".

### 5. Dashboard del Técnico (`/dashboard/technician`)
El centro de operaciones del profesional.
*   **Radar Flash (Tiempo Real):** Panel que muestra solicitudes entrantes (subastas/bids) en la zona. 
*   **Cronómetro de Subasta:** Cada solicitud tiene un temporizador de 5 minutos (cuenta regresiva funcional en la UI). Si el técnico no oferta, la oportunidad se marca como "Perdida".
*   **Gestión de Rendimiento:** Estadísticas del día, ofertas enviadas, trabajos ganados y ganancias estimadas.

### 6. Modal de "Presupuesto Flash"
Flujo interactivo que aparece sobre la pantalla actual para solicitar un precio al instante.
*   **Descripción del Problema:** Textarea para explicar la falla.
*   **Selector de Urgencia:** Botones para indicar si es una "Emergencia (Hoy)" o "Flexible".
*   **Subida de Evidencia:** Interfaz para adjuntar fotos o videos del electrodoméstico dañado.

---

## 🛠️ Tecnologías y Estructura

*   **Framework:** React (Vite)
*   **Enrutamiento:** React Router DOM (Manejo de rutas SPA: `/`, `/search`, `/technician/:id`, etc.)
*   **Estilos:** Tailwind CSS (Diseño responsivo, utilidades y clases dinámicas).
*   **Íconos:** Lucide-React.

### Cómo navegar rápidamente por el MVP
En la barra de navegación superior (Navbar), tienes acceso directo a las principales vistas:
*   Click en **"FixIt"** (Logo) -> Te lleva a la **Landing Page**.
*   Click en **"Panel Técnico"** -> Te lleva al **Dashboard del Técnico**.
*   Click en **"Mi Panel (Cliente)"** -> Te lleva al **Dashboard del Cliente**.

Desde la Landing Page, al hacer una búsqueda o clickear una categoría, irás a los **Resultados de Búsqueda**, y desde allí puedes navegar al **Perfil de cualquier técnico**.

---

## 🔜 Próximos Pasos (Pendientes de Backend)

Dado que este es un prototipo "Web-First" enfocado en la experiencia de usuario (UX/UI), los datos actuales viven en la memoria de React (Mock Data). Los siguientes pasos naturales para escalar el proyecto serían:
1.  **Persistencia de Datos (Backend):** Conectar a una base de datos (Ej: Firebase, Supabase o Node.js/PostgreSQL) para guardar las ofertas reales, usuarios y mensajes.
2.  **Autenticación:** Implementar Login/Registro real para clientes y técnicos.
3.  **Pasarela de Pagos (Stripe):** Conectar la lógica del Escrow con retenciones reales en tarjetas de crédito.
