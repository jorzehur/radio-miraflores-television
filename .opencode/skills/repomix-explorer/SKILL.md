---
name: repomix-explorer
description: Empaqueta y explora el repositorio completo usando instrucciones en lenguaje natural y búsquedas eficientes. Úsalo cuando necesites comprender rápidamente toda la base de código sin saturar el contexto. Ideal para análisis de código, refactors grandes y onboarding.
---

# Repomix Explorer

Skill para explorar y analizar el repositorio de forma eficiente, minimizando el consumo de tokens.

## Cuándo usarla

- Necesitas entender la estructura completa del proyecto
- Vas a hacer un refactor grande y necesitas ver el panorama completo
- Estás haciendo onboarding en el proyecto
- Quieres identificar patrones, duplicación o deuda técnica

## Estrategia de exploración

### 1. Mapeo rápido de estructura
```
Utiliza `list` en directorios clave:
- src/ — estructura de componentes, páginas, API routes
- prisma/ — esquema de base de datos
- .opencode/ — configuración del proyecto
```

### 2. Búsqueda dirigida
```
Usa `grep` con patrones específicos para encontrar:
- Importaciones de librerías clave (Prisma, shadcn, framer-motion)
- Patrones de diseño (Server Components, "use client")
- Referencias a tipos, interfaces, funciones compartidas
```

### 3. Lectura estratégica
```
Lee archivos en este orden:
1. Archivos de configuración (next.config.ts, tailwind.config.ts, package.json)
2. Layouts y providers (layout.tsx, providers.tsx)
3. Tipos compartidos (types/, lib/types.ts)
4. Componentes principales (sections/, components/)
5. API routes (api/)
```

### 4. Resumen de hallazgos
```
Después de explorar, presenta:
- Estructura general del proyecto
- Patrones clave encontrados
- Puntos de extensión principales
- Posibles problemas o deuda técnica
```

## Formato de entrega

Al finalizar, entrega un resumen estructurado:

```markdown
## Estructura del proyecto
...
## Patrones clave
...
## Puntos de entrada principales
...
## Observaciones
...
```
