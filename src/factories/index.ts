/**
 * Domain object factories for testing
 *
 * Provides factory functions to create mock domain objects
 * with sensible defaults and auto-incrementing IDs.
 */

export * from './preset.js';
export * from './category.js';
export * from './vote.js';
export * from './user.js';
export * from './dye.js';

// Re-export counter utilities for test setup
export { resetCounters, resetCounter, getCounterValue } from '../utils/counters.js';
