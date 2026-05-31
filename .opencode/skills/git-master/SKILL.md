---
name: git-master
description: Realiza commits atómicos y operaciones complejas de control de versiones. Úsalo para commits convencionales, changelogs, releases, rebase interactivo, y gestión de ramas. Actívalo cuando necesites operaciones git avanzadas.
---

# Git Master

Skill especializada en operaciones de control de versiones con Git.

## Commits Atómicos

- Cada commit debe representar un **cambio lógico único** y atómico
- Usa [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` — nueva funcionalidad
  - `fix:` — corrección de bug
  - `refactor:` — refactorización sin cambios funcionales
  - `chore:` — tareas de mantenimiento
  - `docs:` — documentación
  - `style:` — formato, linting
  - `perf:` — mejoras de rendimiento
  - `test:` — tests
- Cuerpo del commit: explica el qué y el porqué, no el cómo

## Flujo de trabajo recomendado

1. `git status` — ver estado actual
2. `git diff` — revisar cambios antes de commitear
3. `git add -A` o `git add <archivos específicos>`
4. `git commit -m "tipo(ámbito): descripción"`
5. `git log --oneline -10` — verificar historial

## Operaciones avanzadas

- **Rebase interactivo**: `git rebase -i HEAD~n` para limpiar historial
- **Cherry-pick**: `git cherry-pick <commit>` para traer cambios específicos
- **Stash**: `git stash push -m "mensaje"` / `git stash pop`
- **Tagging**: `git tag -a v1.0.0 -m "mensaje"` para releases
- **Changelog**: generar desde mensajes de commits convencionales

## Seguridad

- **NUNCA** commitees secrets, API keys, `.env`, `node_modules/`
- Verifica `.gitignore` antes de commitear archivos nuevos
- Usa `git diff --cached` para revisar el staged content
