---
name: prisma-manager
description: Genera y valida migraciones de Prisma de forma segura para SQLite. Úsalo cuando el usuario pida modificar el esquema de base de datos o añadir tablas.
---

# Gestión Segura de Prisma
1. La variable de entorno obligatoria es `DATABASE_URL=file:./db/custom.db`.
2. Para cambios en `prisma/schema.prisma`, ejecuta SIEMPRE `npx prisma validate` primero.
3. Para generar migraciones, usa `npx prisma migrate dev --create-only`. NUNCA uses `db push --force-reset`.
4. Muestra el código SQL generado al humano y pide aprobación antes de aplicarlo.
