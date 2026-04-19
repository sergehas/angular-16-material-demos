---
applyTo: "**/*.ts,**/*.tsx"
---

# Project coding standards for TypeScript

Apply the [general coding guidelines](./general-coding.instructions.md) to all code.

## TypeScript Guidelines

- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use enums for fixed sets of values
- Use type guards for type narrowing
- Avoid using `any` type; prefer specific types or `unknown` if type is not known.
- Use `as const` for literal types when appropriate
- Use JSDoc comments for complex functions and classes. Document parameters, return types, and any important details about behavior.
- Use interfaces for data structures and type definitions
- Prefer immutable data (`const`, `readonly`).
- Use optional chaining (`?.`) and nullish coalescing (`??`).
- Avoid using `var`; use `let` and `const` instead
- For Angular/RxJS code prefer observable pipelines over raw `async/await`; use `async/await` only for non-Angular utilities
- Use `Promise.all` for concurrent non-RxJS async operations
- avoid unnecessary type assertions; let TypeScript infer types when possible
- avoid unnecessary '!' assertions
- document all methods and classes with JSDoc comments, including parameters, return types, and any important details about behavior.

## tests

- Test coverage should be at least 80% for all branches.
- Use descriptive test names that explain the expected behavior.

### Test Structure

- Name test files with `.spec.ts` suffix
- Tests should be placed in alongside the code they test.
- Use descriptive test names that explain the expected behavior
- Use nested describe blocks to organize related tests
- Follow the pattern: `describe('Component/Function/Class', () => { it('should do something', () => {}) })`
- Use `beforeEach` and `afterEach` hooks for setup and teardown.
- Use `expect` assertions to verify behavior.
