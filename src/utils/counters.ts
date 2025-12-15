/**
 * Auto-increment counter management for test factories
 *
 * Provides unique IDs for test objects while allowing reset between tests
 * to ensure test isolation.
 */

// Counter storage
const counters: Record<string, number> = {};

/**
 * Get the next value for a named counter
 * @param name - The counter name (e.g., 'preset', 'category')
 * @returns The next sequential value
 */
export function nextId(name: string): number {
  if (!(name in counters)) {
    counters[name] = 0;
  }
  counters[name]++;
  return counters[name];
}

/**
 * Get a string ID with prefix
 * @param prefix - The ID prefix (e.g., 'preset', 'category')
 * @returns A string ID like 'preset-1', 'category-2'
 */
export function nextStringId(prefix: string): string {
  return `${prefix}-${nextId(prefix)}`;
}

/**
 * Reset all counters to zero
 * Call this in beforeEach() for test isolation
 */
export function resetCounters(): void {
  for (const key in counters) {
    delete counters[key];
  }
}

/**
 * Reset a specific counter
 * @param name - The counter name to reset
 */
export function resetCounter(name: string): void {
  delete counters[name];
}

/**
 * Get the current value of a counter (without incrementing)
 * @param name - The counter name
 * @returns The current counter value, or 0 if not set
 */
export function getCounterValue(name: string): number {
  return counters[name] ?? 0;
}
