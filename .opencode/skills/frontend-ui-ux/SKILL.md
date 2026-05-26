---
name: frontend-ui-ux
description: Especializado en diseño de interfaces con shadcn/ui, Tailwind CSS v4 y Framer Motion. Úsalo para crear UI consistentes, accesibles y atractivas siguiendo las convenciones del proyecto.
---

# Frontend UI/UX

Skill especializada en diseño de interfaces para el proyecto Radio Miraflores Televisión.

## Stack de UI

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Estilos**: Tailwind CSS v4 (config en `tailwind.config.ts`)
- **Componentes**: shadcn/ui (Radix UI primitives)
- **Formularios**: react-hook-form + Zod
- **Animaciones**: Framer Motion
- **Gráficos**: recharts
- **Iconos**: Lucide React (vía shadcn/ui)

## Principios de diseño

1. **Consistencia visual** — Usa el sistema de diseño existente (colores, tipografía, espaciado, bordes del tema Tailwind)
2. **Mobile-first** — Diseña primero para mobile, luego mejora para desktop con `sm:`, `md:`, `lg:`
3. **Server Components** por defecto — Solo usa `"use client"` cuando necesites interactividad, hooks o estado
4. **Componentes atómicos** — Prefiere componer desde los ~50 componentes base en `src/components/ui/`
5. **Accesibilidad** — Etiquetas semánticas, ARIA, focus management, navegación por teclado
6. **Animaciones sutiles** — Framer Motion para micro-interacciones, transiciones de página y estados de carga

## Patrones comunes

- **Loading states**: Usa `Suspense` con fallbacks o componentes `Skeleton` de shadcn/ui
- **Empty states**: Muestra mensajes informativos cuando no hay datos
- **Error states**: Usa `error.tsx` (pages) o `ErrorBoundary` (componentes)
- **Formularios**: `react-hook-form` + `zod` + componentes shadcn/ui (`Form`, `Input`, `Select`, etc.)
- **Tablas**: `TanStack Table` + shadcn/ui `Table` component
- **Diálogos**: `Dialog` de shadcn/ui para modales
- **Notificaciones**: `Sonner` o `Toast` de shadcn/ui

## Convenciones del proyecto

- Busca en `src/components/` componentes existentes antes de crear nuevos
- Sigue el patrón de naming que ya existe en el proyecto
- Revisa `src/app/globals.css` para variables CSS personalizadas
- Usa las clases de color del tema: `bg-primary`, `text-muted-foreground`, etc.
