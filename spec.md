# Peluquería Web

## Current State
App has multi-phase features: barber selection, admin panel, advanced admin panel, pro panel, WhatsApp reminders. Complex React app in App.tsx.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Replace entire frontend with the clean base version provided by user
- Reservation form: nombre, teléfono, servicio (multi-select), fecha, hora, mensajeWhatsApp editable
- Reservation table with columns: Nombre, Teléfono, Fecha, Hora, Servicios, Total, Estado, Acciones
- Buttons: Confirmar (generates WhatsApp link), Cancelar, Hacer otra reserva
- localStorage persistence for reservas
- Mobile-first responsive design, polished UI

### Remove
- All previous phases (barber selection, admin panel, advanced admin, pro panel, WhatsApp scheduler)

## Implementation Plan
1. Rewrite App.tsx as clean React component implementing exact feature set from provided HTML
2. Use localStorage for persistence, load on mount
3. Fix UX issues: WhatsApp link should open in new tab (not alert), mobile responsive layout
4. Confirm/Cancel updates state + persists
5. "Hacer otra reserva" resets form without clearing table
