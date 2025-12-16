# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@xivdyetools/test-utils`, a shared testing utilities library for the xivdyetools ecosystem. It provides mocks for Cloudflare Workers bindings, authentication helpers, domain object factories, and DOM utilities for use in Vitest test suites.

## Commands

```bash
npm run build          # Build the package (TypeScript compilation)
npm run test           # Run all tests (unit + integration)
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run type-check     # TypeScript type checking without emitting
npm run clean          # Remove dist/ directory
```

Run a single test file:
```bash
npx vitest run tests/cloudflare/d1.test.ts
```

Run tests matching a pattern:
```bash
npx vitest run -t "createMockD1Database"
```

## Architecture

The library is organized into subpath exports that can be imported independently:

- **`/cloudflare`** - Mocks for Cloudflare Workers bindings (D1Database, KVNamespace, R2Bucket, AnalyticsEngineDataset, Fetcher). Each mock includes introspection properties (`_queries`, `_bindings`, `_data`) and a `_reset()` method for test isolation.

- **`/auth`** - JWT creation/verification, HMAC signature generation for bot authentication, and auth context factories for middleware testing.

- **`/factories`** - Domain object factories (Preset, Category, Vote, User, Dye) with auto-incrementing IDs. Use `resetCounters()` in `beforeEach` to ensure ID isolation between tests.

- **`/dom`** - Browser API mocks (localStorage, Canvas, ResizeObserver, matchMedia, fetch) for testing frontend code.

- **`/assertions`** - Response assertion helpers like `assertJsonResponse()` for API testing.

- **`/constants`** - RFC 7636 compliant PKCE test values and other test constants.

## Key Patterns

**Mock Setup Pattern**: Cloudflare mocks use `_setupMock()` to configure response behavior based on queries/keys:
```typescript
const db = createMockD1Database();
db._setupMock((query, bindings) => {
  if (query.includes('SELECT')) return { id: 1 };
  return null;
});
```

**Counter Reset**: Factory-generated IDs auto-increment. Always reset in test setup:
```typescript
beforeEach(() => resetCounters());
```

## Dependencies

- Requires `vitest` as a peer dependency (>=2.0.0)
- Depends on `@xivdyetools/types` for domain type definitions
- Uses `@cloudflare/workers-types` for Cloudflare binding type definitions
