---
trigger: glob
glob: "{src/components/**/*.tsx,app/**/*.tsx}"
---

# Estándares de Frontend
1. Usa estrictamente Next.js 16.1.1 App Router y Tailwind CSS v4.
2. Utiliza Shadcn/UI como base de componentes (respeta el `components.json`).
3. Los componentes públicos en `src/components/sections/` solo deben consumir APIs locales de `/app/api/public/*`.
