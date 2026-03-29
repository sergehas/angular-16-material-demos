# Copilot Instructions (GUI)

## Summary

- This is an Angular (v19) Material starter with standalone components and a small feature/core/shared split.
- Key ideas: `core` holds singletons/services, `shared` contains UI-only standalone components, features contain routing and pages.

## Quick commands (examples)

- Dev server: `npm start` (runs `ng serve`) — open http://localhost:4200
- Build: `npm run build` (runs `ng build`)
- Unit tests: `npm test` (Karma/Jasmine via Angular CLI)
- E2E (Playwright): start the app, then `npx playwright test`; to record: `npx playwright codegen http://localhost:4200`
- Build icon library: `npm run build:iconLib` (runs `node ./buildIconLib.js`)

## Project layout & patterns (what to know)

- `src/app/core/` — singletons and services. Services must live here (or nested feature services) to ensure single-instance behavior. Example: `src/app/core/services/notification.service.ts`.
- `src/app/shared/` — UI-only standalone components, directives and pipes. They MUST NOT provide services (to avoid multiple instances).
- Features: each feature has its own routing module under `src/app/<feature>/` and exposes a main page plus subpages. Use standalone components where possible.
- Routing: feature routes are registered via feature routing modules (see `app/demo/demo-routing.module.ts`). `data` route property is used for animation config.

## Conventions and small gotchas

- Prefer Angular standalone components; when adding older-style modules keep services in `core` to preserve singleton scope.
- Use `ChangeDetectionStrategy.OnPush` for all new components to optimize performance by reducing unnecessary change detection cycles. This is a critical best practice in Angular development that can significantly improve the responsiveness of the application, especially as it scales.
- Shared components should not add providers. If a shared widget needs state, create a service in `core` and inject it where needed.
- Icon handling: icons are declared in `src/assets/iconlib.json` and built with `buildIconLib.js`. Use `npm run build:iconLib` after editing source SVGs.
- i18n: translations live in `src/assets/i18n/*.json` and the project uses `@ngx-translate`.
- External deps of note: `exceljs`, `xlsx` (pinned to a CDN tarball in `package.json`), `@playwright/test` for e2e.
- Linting and formatting: `lint-staged`, `husky`, `eslint` and `prettier` are configured; `npm run lint` and `npm run pretty` run formatting/linting flows.

## Testing & CI notes

- Unit tests run with `ng test` (Karma). Keep spec files alongside components (existing pattern in `src/app/**/pages/*/*.spec.ts`).
- E2E requires the app to be started locally for recorded tests. Use Playwright's reporter: `npx playwright show-report` after tests.

## Integration points to review when changing code

- `package.json` scripts — many repo workflows use npm scripts rather than typed CLI invocations.
- `playwright.config.ts` — controls browsers and test options.
- `buildIconLib.js` and `src/assets/iconlib.json` — editing icons often requires running the build script and updating assets.

## Files to inspect for more context

- README: [README.md](../README.md)
- Core services: `src/app/core/services/` (e.g. `notification.service.ts`)
- Icon builder: `buildIconLib.js`
- E2E examples: `e2e/**` and `playwright.config.ts`
- For all questions related to angular use : [@agents/angular_tech_lead]: .github/agents/angular.agent.md
- For all questions related to css use : [@agents/css_expert]: .github/agents/css.agent.md

If anything above is unclear or you'd like more detail (examples of adding a feature, or a checklist for PRs), tell me what to expand.
