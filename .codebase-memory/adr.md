## PURPOSE
Radio Miraflores TV - Revisión completa antes de agregar al repositorio

## STACK
- Next.js 16.1.1 (App Router)
- TypeScript
- Tailwind CSS v4
- Shadcn/UI
- Prisma ORM
- SQLite (DATABASE_URL=file:./db/custom.db)

## ARCHITECTURE
- **App Router**: Estructura modular en directorios app/, pages/
- **APIs Públicas**: Solo lectura en /app/api/public/*
- **APIs Admin**: Gestión de contenido con verificación de sesión en /app/api/admin/*
- **Componentes Públicos**: Exclusivos en src/components/sections/

## PATTERNS
- Autenticación 100% custom
- Componentes reutilizables con shadcn/ui
- Rutas API separadas por nivel de acceso
- Uso estricto de Prisma para acceso a datos

## TRADEOFFS
- Autenticación custom vs soluciones como NextAuth: mayor control pero mayor responsabilidad
- SQLite para desarrollo: simplicidad vs limitaciones en producción
- Tailwind CSS v4: últimas características vs estabilidad

## PHILOSOPHY
Priorizar seguridad y buenas prácticas sobre velocidad de desarrollo