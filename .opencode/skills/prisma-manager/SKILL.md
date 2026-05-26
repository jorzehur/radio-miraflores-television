---
name: prisma-manager
description: Use when the user asks about Prisma schema changes, database migrations, or SQLite modifications. Handles all Prisma CLI operations for the project.
---

# Prisma Manager — Radio Miraflores TV

Este skill gestiona todas las operaciones de Prisma y SQLite del proyecto.

## Reglas estrictas

1. **Siempre usa `npx prisma migrate dev --create-only`** para crear migraciones. Esto genera un archivo de migración SQL sin aplicarlo automáticamente, permitiendo revisión.
2. **Nunca uses `npx prisma db push`** — es destructivo y puede causar pérdida de datos. Está terminantemente prohibido.
3. Después de crear la migración con `--create-only`, aplica los cambios con `npx prisma migrate dev`.

## Flujo de trabajo

```bash
# 1. Editar prisma/schema.prisma con los cambios necesarios

# 2. Crear migración (genera SQL sin aplicar)
npx prisma migrate dev --create-only --name descripcion_del_cambio

# 3. Revisar el SQL generado en prisma/migrations/<timestamp>/

# 4. Aplicar la migración
npx prisma migrate dev

# 5. Regenerar el cliente Prisma
npx prisma generate
```

## Seed

Después de migrar, ejecutar el seed si es necesario:

```bash
npx prisma db seed
```

## Validación

- Verificar que el esquema SQLite sea compatible (sin tipos no soportados por SQLite como `enum`, `json`, etc.)
- SQLite no soporta `ALTER COLUMN`, `DROP COLUMN`, o agregar constraints `NOT NULL` a columnas existentes. Planea las migraciones en consecuencia.
- Los modelos deben usar `@default()` para valores por defecto compatibles con SQLite.
