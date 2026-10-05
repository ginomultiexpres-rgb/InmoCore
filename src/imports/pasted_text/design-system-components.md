#
Pantalla
Descripción
1
Dashboard del Asesor
KPIs, gráficas, actividad reciente, accesos rápidos
2
Portafolio Público (Mobile)
Lo que ve el cliente: propiedades, filtros, botones de WhatsApp y Reservar
3
CRM Kanban
Pipeline de ventas con columnas y tarjetas de leads arrastrables
4
Panel de Propiedades
Grid admin con tarjetas, badges de estado, métricas y acciones
5
Formulario Nueva Propiedad
Uploader de 4 fotos con stepper de 4 pasos
6
Branding / Personalización
Editor de colores, logo, template con vista previa en vivo
7
Agenda de Visitas
Calendario semanal con reservas y panel de disponibilidad
8
Generador de QR Codes
QR del portafolio + QR por propiedad + preview del cartel PDF
9
Analíticas
KPIs, gráficas de tráfico, embudo de conversión, top propiedades

🎯 Design System (Para replicar en )
Paleta de Colores

Primary:        #1E88E5 (Azul)
Primary Dark:   #1565C0
Primary Light:  #BBDEFB
Secondary:      #FFC107 (Ámbar)
Success:        #4CAF50 (Verde)
WhatsApp:       #25D366
Warning:        #FF9800 (Naranja)
Danger:         #F44336 (Rojo)
Info:           #2196F3

Background:     #F5F7FA
Surface:        #FFFFFF
Border:         #E0E0E0

Text Primary:   #212121
Text Secondary: #757575
Text Disabled:  #BDBDBD

Tipografía

Familia: Inter (Google Fonts)

H1: 32px / Bold / #212121
H2: 24px / SemiBold / #212121
H3: 20px / SemiBold / #212121
H4: 16px / Medium / #212121
Body: 14px / Regular / #212121
Caption: 12px / Regular / #757575
Button: 14px / Medium / #FFFFFF

Espaciado y Bordes

Border Radius:
  Cards: 12px
  Buttons: 8px
  Inputs: 8px
  Badges: 20px (pill)
  Avatar: 50% (circle)

Shadows:
  Card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)
  Elevated: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
  Modal: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)

Spacing Grid: 4px base (4, 8, 12, 16, 24, 32, 48, 64)

🧩 Componentes para Crear en 
Componentes Base (Atomic Design)

📁 Atoms
├── Button (Primary, Secondary, Ghost, Danger, WhatsApp)
├── Input (Text, Search, Select, Textarea)
├── Badge (Status: Active/Reserved/Sold, Priority: Hot/Medium/Low)
├── Avatar (Small 32px, Medium 40px, Large 64px)
├── Icon (24px grid, outlined style)
├── Tag/Pill (Filter pills)
├── Progress Bar
├── Toggle Switch
└── Checkbox / Radio

📁 Molecules
├── Property Card (Photo + Price + Title + Specs + Actions)
├── Lead Card (Avatar + Name + Budget + Property + Priority)
├── KPI Metric Card (Icon + Number + Label + Trend)
├── Photo Upload Slot (Empty state + Filled state)
├── Calendar Event Block
├── QR Code Card (QR + Info + Download buttons)
├── Notification Item
├── Search Bar with Filters
└── WhatsApp CTA Button (with pre-filled message indicator)

📁 Organisms
├── Sidebar Navigation
├── Top Header Bar
├── Kanban Column (Header + Cards)
├── Property Grid (3-column responsive)
├── Analytics Chart Section
├── Branding Editor Panel
├── Calendar Week View
├── Lead Detail Drawer (Side panel)
└── Reservation Modal

Variantes de Property Card

Property Card / Grid View
  ├── Status: Active (green badge)
  ├── Status: Reserved (orange badge)
  ├── Status: Sold (red badge)
  └── State: Default / Hover / Selected

Property Card / Public (Mobile)
  ├── With WhatsApp + Reserve buttons
  └── With Call + Email buttons

Property Card / Kanban (Mini)
  └── Compact version for lead cards

🔄 Flujo de Trabajo:  + Make
Arquitectura de Automatización

┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│        │────►│    MAKE      │────►│   BACKEND       │
│  (Diseño)   │     │ (Automatiza) │     │   (NestJS)      │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼────┐ ┌────▼─────┐ ┌───▼──────┐
        │  Email   │ │WhatsApp  │ │  Base de │
        │ (Resend) │ │  (API)   │ │  Datos   │
        └──────────┘ └──────────┘ └──────────┘
Escenarios de Make (Automatizaciones Clave)
Escenario 1: Nueva Reserva → Notificaciones

Trigger: Webhook (POST /reservations desde el backend)
    │
    ├──► Módulo 1: Formatear datos (nombre, fecha, propiedad)
    │
    ├──► Módulo 2: Enviar Email al Asesor (Resend/SendGrid)
    │    "Nueva reserva: María García - Depa Polanco - Lunes 15, 10:00"
    │
    ├──► Módulo 3: Enviar WhatsApp al Asesor (Twilio/360dialog)
    │    "📅 Nueva visita agendada: María García para Depa Polanco"
    │
    ├──► Módulo 4: Enviar Email de Confirmación al Cliente
    │    "Tu visita ha sido confirmada para el lunes 15 a las 10:00"
    │
    └──► Módulo 5: Crear evento en Google Calendar del Asesor
         (Google Calendar API)

Escenario 2: Recordatorio de Visita (24h antes)

Trigger: Schedule (cada hora)
    │
    ├──► Módulo 1: Consultar BD (reservas de mañana con status=confirmed)
    │
    ├──► Módulo 2: Iterar sobre cada reserva
    │
    ├──► Módulo 3: Enviar WhatsApp al Cliente
    │    "🔔 Recordatorio: Mañana tienes visita a Depa Polanco a las 10:00"
    │
    ├──► Módulo 4: Enviar Email al Cliente
    │    Con dirección, mapa, y datos del asesor
    │
    └──► Módulo 5: Actualizar campo reminder_sent = true

Escenario 3: Nuevo Lead desde Portafolio Público

Trigger: Webhook (POST desde el botón "Reservar" o formulario)
    │
    ├──► Módulo 1: Crear Lead en CRM (API del backend)
    │    Stage: "new", Source: "web"
    │
    ├──► Módulo 2: Notificar al Asesor (Push + In-App)
    │    "🔥 Nuevo lead: María García interesada en Depa Polanco"
    │
    └──► Módulo 3: Si el lead viene de QR → Incrementar scans_count

Escenario 4: Límite de Plan Alcanzado (Upsell)

Trigger: Webhook (cuando el asesor intenta crear la propiedad #21)
    │
    ├──► Módulo 1: Enviar Email de Upsell
    │    "Has alcanzado el límite de 20 propiedades. 
    │     Actualiza a Professional por $29/mes"
    │
    └──► Módulo 2: Crear tarea en el CRM del equipo de ventas interno
         "Contactar a Juan Pérez para upgrade"

Escenario 5: Reporte Semanal Automático

Trigger: Schedule (cada lunes 8:00 AM)
    │
    ├──► Módulo 1: Consultar analytics de la semana anterior
    │
    ├──► Módulo 2: Generar resumen (visitas, clics, reservas, leads)
    │
    └──► Módulo 3: Enviar Email al Asesor
         "📊 Tu semana en InmoCore: 320 visitas, 45 WhatsApps, 
          8 reservas, 3 nuevos leads"

📋 Checklist para Implementar en 
Paso 1: Configurar el Proyecto
Crear archivo  "InmoCore - SaaS Inmobiliario"
Crear páginas: 🎨 Design System, 📱 Mobile, 💻 Desktop, 🔗 Flows
Instalar plugin "Inter" font
Configurar grid: 12 columnas, 1440px desktop, 375px mobile
Paso 2: Construir Design System
Crear estilos de color (local styles)
Crear estilos de texto (H1-H4, Body, Caption)
Crear estilos de efecto (shadows)
Construir componentes atómicos (botones, inputs, badges)
Construir componentes moleculares (cards, KPIs)
Documentar variantes y estados
Paso 3: Ensamblar Pantallas
Dashboard del Asesor (Desktop)
Panel de Propiedades (Desktop)
Formulario Nueva Propiedad (Desktop)
CRM Kanban (Desktop)
Agenda de Visitas (Desktop)
Branding Settings (Desktop)
QR Generator (Desktop)
Analytics (Desktop)
Portafolio Público (Mobile)
Modal de Reserva (Mobile)
Paso 4: Crear Prototipo Interactivo
Conectar Dashboard → Propiedades → Nueva Propiedad
Conectar Propiedades → Compartir → Portafolio Público
Conectar Portafolio Público → WhatsApp (link externo)
Conectar Portafolio Público → Reservar → Modal Calendario
Conectar Dashboard → CRM Kanban → Lead Detail
Conectar Dashboard → Agenda → Configurar Disponibilidad
Paso 5: Handoff a Desarrollo
Usar  Dev Mode para exportar specs
Exportar assets (íconos SVG, imágenes)
Documentar tokens de diseño (JSON para Tailwind)
Crear documento de componentes con estados

🛠️ Plugins de  Recomendados


Plugin
Uso
Autoflow
Crear user flows con flechas entre pantallas
Content Reel
Datos realistas (nombres, avatares, textos)
Unsplash
Fotos de propiedades para los mockups
Iconify
Íconos (Lucide, Heroicons, Material)
Figma to Code
Exportar a HTML/Tailwind/React
Tokens Studio
Design tokens sincronizados con código
Contrast
Verificar accesibilidad WCAG



2. Webhooks en Make
Configura webhooks que se disparen cuando:
Se crea una nueva reserva en el backend
Un lead cambia de etapa en el CRM
Se alcanza el límite del plan
3. Módulos de Make Necesarios
- Webhooks (Custom webhook)
- HTTP (para llamar APIs del backend)
- Gmail / Resend (emails)
- Twilio / 360dialog (WhatsApp)
- Google Calendar (sincronización)
- Data Store (cache temporal)
- Router (lógica condicional)
- Iterator (procesar listas)

