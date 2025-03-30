import js from "@eslint/js";
import json from "@eslint/json";
import angular from "angular-eslint";
import prettierConfig from "eslint-config-prettier";
import playwright from "eslint-plugin-playwright";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import typescript from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "node_modules",
    "package-lock.json",
    ".husky",
    "playwright-report/",
    "test-results/",
    ".vscode/",
  ]),
  prettierConfig,
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: [],
    ...js.configs.recommended,
    extends: [prettierConfig],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      prettierConfig,
      js.configs.recommended,
      ...typescript.configs.recommended,
      ...typescript.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/component-class-suffix": [
        "error",
        {
          suffixes: ["Component", "Dialog"],
        },
      ],
    },
  },
  {
    files: ["e2e/**/*.ts"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      prettierConfig,
      js.configs.recommended,
      ...typescript.configs.recommended,
      ...typescript.configs.stylistic,
      ...angular.configs.tsRecommended,
      playwright.configs["flat/recommended"],
    ],
    rules: {
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      prettierConfig,
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    files: ["**/*.json"],
    language: "json/json",
    extends: [prettierConfig],
    ignores: ["**/package-lock.json"],
    ...json.configs.recommended,
    rules: {
      "no-irregular-whitespace": "off", //bugged
    },
  },
]);
