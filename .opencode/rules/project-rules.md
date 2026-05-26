# Reglas del Proyecto — Radio Miraflores Televisión

## Stack tecnológico obligatorio

- **Base de datos:** SQLite exclusivamente vía Prisma ORM. No se permite cambiar a PostgreSQL, MySQL u otro motor.
- **Autenticación:** Implementación custom con JWT + bcrypt (ver `src/lib/admin-auth.ts`). Prohibido agregar NextAuth, Auth.js, Clerk u otras dependencias de autenticación.
- **ORM:** Prisma 6 exclusivamente. No agregar Drizzle, Kysely u otros ORMs.

## API públicas

- Los endpoints en `src/app/api/public/*` son **estrictamente de solo lectura (GET)**.
- Cualquier mutación debe hacerse exclusivamente a través de `src/app/api/admin/*`.

## Frontend

- **Server Components por defecto.** Solo usar `'use client'` cuando sea estrictamente necesario (interactividad, hooks, estado).
- **shadcn/ui + Tailwind CSS v4** para componentes UI. No agregar otras librerías de componentes.
- **TanStack Query** para fetching de datos del lado del cliente. No usar SWR, RTK Query u otros.
- **Zustand** para estado global. No usar Redux, Jotai, u otros.
- **TanStack Table** para tablas de datos. No usar otras librerías de tablas.
- **Framer Motion** para animaciones.
- **Zod** para validación de formularios (con react-hook-form).
