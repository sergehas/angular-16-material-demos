# Copilot Instructions

This file is intentionally limited to repository-specific context.
General coding rules, testing standards, CSS standards, and Angular best practices are maintained in `.github/instructions/`, `.github/agents/`, and `.github/skills/`.

## Repository Snapshot

- Angular Material starter with a feature/core/shared split.
- Main app code is under `src/app/`.

## Project Structure (Repo-Specific)

- `src/app/core/`: singleton-oriented domain services and cross-cutting services.
- `src/app/shared/`: reusable UI-only standalone components, directives, and pipes.
- `src/app/features/`: feature areas (`demo`, `nav`, `list-of-values`, `art-institute`) with pages and routing.
- `src/assets/i18n/`: locale JSON files (`en-US.json`, `fr-FR.json`, `pt-PT.json`).
- `src/assets/iconLib.json` + `buildIconLib.js`: icon library source and build flow.

## High-Value Integration Points

- `package.json`: scripts used by local workflows and automation.
- `angular.json`: Angular build/test/serve targets.
- `playwright.config.ts`: E2E browser/test behavior.
- `eslint.config.mjs`: lint configuration.
- `buildIconLib.js`: icon library generation pipeline.

## Pointers to Authoritative Guidance

- use only english for code comments, commit messages, documentation, and i18n keys
- Global coding and architecture rules: `.github/instructions/*.instructions.md`
- Agent specializations: `.github/agents/*.agent.md`
- Task-specific playbooks: `.github/skills/*/SKILL.md`

## Useful Entry Files

- `README.md`
- `src/app/app.routes.ts`
- `src/main.ts`
- `src/styles.scss`
