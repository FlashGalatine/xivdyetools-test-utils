/**
 * Mock D1 Database for testing Cloudflare Workers
 *
 * Provides a mock implementation of D1Database that tracks queries
 * and allows custom mock responses for testing.
 *
 * @example
 * ```typescript
 * const db = createMockD1Database();
 *
 * // Setup mock responses
 * db._setupMock((query, bindings) => {
 *   if (query.includes('SELECT') && query.includes('presets')) {
 *     return [{ id: 'preset-1', name: 'Test Preset' }];
 *   }
 *   return null;
 * });
 *
 * // Use in tests
 * const env = { DB: db as unknown as D1Database };
 *
 * // Assert queries were made
 * expect(db._queries).toContain('SELECT * FROM presets');
 * expect(db._bindings[0]).toEqual(['param1']);
 *
 * // Reset between tests
 * db._reset();
 * ```
 */

/**
 * Function type for mocking query responses
 */
export type QueryMockFn = (query: string, bindings: unknown[]) => unknown;

/**
 * Mock D1 prepared statement interface
 */
export interface MockD1PreparedStatement {
  bind: (...values: unknown[]) => MockD1PreparedStatement;
  first: <T = unknown>() => Promise<T | null>;
  all: <T = unknown>() => Promise<{ results: T[]; success: boolean; meta: D1Meta }>;
  run: () => Promise<{ success: boolean; meta: { changes: number; duration: number; last_row_id: number } }>;
  raw: <T = unknown[]>() => Promise<T[]>;
}

/**
 * D1 result metadata
 */
interface D1Meta {
  duration: number;
  changes: number;
  last_row_id: number;
  rows_read: number;
  rows_written: number;
}

/**
 * Extended mock D1 database with test helpers
 */
export interface MockD1Database {
  prepare: (query: string) => MockD1PreparedStatement;
  batch: <T = unknown>(statements: MockD1PreparedStatement[]) => Promise<Array<{ results: T[]; success: boolean; meta: D1Meta }>>;
  exec: (query: string) => Promise<{ count: number; duration: number }>;
  dump: () => Promise<ArrayBuffer>;

  /** Array of all queries executed (for assertions) */
  _queries: string[];

  /** Array of all binding arrays passed to queries */
  _bindings: unknown[][];

  /** Setup a mock function to return custom responses */
  _setupMock: (fn: QueryMockFn) => void;

  /** Reset queries, bindings, and mock function */
  _reset: () => void;

  /** Current mock function (if any) */
  _mockFn?: QueryMockFn;
}

/**
 * Creates a mock D1 database for testing
 *
 * The mock tracks all queries and bindings for assertions, and supports
 * custom response functions for simulating database behavior.
 *
 * @returns A mock D1 database that can be cast to D1Database
 */
export function createMockD1Database(): MockD1Database {
  const queries: string[] = [];
  const bindings: unknown[][] = [];
  let mockFn: QueryMockFn | undefined;

  const createDefaultMeta = (): D1Meta => ({
    duration: 0,
    changes: 0,
    last_row_id: 0,
    rows_read: 0,
    rows_written: 0,
  });

  const createStatement = (query: string): MockD1PreparedStatement => {
    let boundValues: unknown[] = [];

    const statement: MockD1PreparedStatement = {
      bind: (...values: unknown[]) => {
        boundValues = values;
        bindings.push(values);
        return statement;
      },

      first: async <T = unknown>() => {
        queries.push(query);
        if (mockFn) {
          const result = mockFn(query, boundValues);
          // If result is an array, return first element
          if (Array.isArray(result)) {
            return (result[0] ?? null) as T | null;
          }
          return result as T | null;
        }
        return null;
      },

      all: async <T = unknown>() => {
        queries.push(query);
        if (mockFn) {
          const result = mockFn(query, boundValues);
          if (Array.isArray(result)) {
            return { results: result as T[], success: true, meta: createDefaultMeta() };
          }
          // If single object returned, wrap in array
          if (result && typeof result === 'object') {
            return { results: [result] as T[], success: true, meta: createDefaultMeta() };
          }
        }
        return { results: [] as T[], success: true, meta: createDefaultMeta() };
      },

      run: async () => {
        queries.push(query);
        if (mockFn) {
          const result = mockFn(query, boundValues);
          if (result && typeof result === 'object' && 'meta' in result) {
            return result as { success: boolean; meta: { changes: number; duration: number; last_row_id: number } };
          }
        }
        return {
          success: true,
          meta: { changes: 1, duration: 0, last_row_id: 1 },
        };
      },

      raw: async <T = unknown[]>() => {
        queries.push(query);
        if (mockFn) {
          const result = mockFn(query, boundValues);
          if (Array.isArray(result)) {
            // Convert objects to arrays of values
            return result.map((row) => {
              if (typeof row === 'object' && row !== null) {
                return Object.values(row) as T;
              }
              return row as T;
            });
          }
        }
        return [] as T[];
      },
    };

    return statement;
  };

  return {
    prepare: createStatement,

    batch: async <T = unknown>(statements: MockD1PreparedStatement[]) => {
      const results: Array<{ results: T[]; success: boolean; meta: D1Meta }> = [];
      for (const stmt of statements) {
        // Execute each statement's run method
        await stmt.run();
        results.push({ results: [] as T[], success: true, meta: createDefaultMeta() });
      }
      return results;
    },

    exec: async (query: string) => {
      queries.push(query);
      return { count: 1, duration: 0 };
    },

    dump: async () => {
      return new ArrayBuffer(0);
    },

    _queries: queries,
    _bindings: bindings,

    _setupMock: (fn: QueryMockFn) => {
      mockFn = fn;
    },

    _reset: () => {
      queries.length = 0;
      bindings.length = 0;
      mockFn = undefined;
    },

    get _mockFn() {
      return mockFn;
    },
  };
}
