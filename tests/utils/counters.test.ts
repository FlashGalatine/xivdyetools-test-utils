/**
 * Tests for counter utility functions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  nextId,
  nextStringId,
  resetCounters,
  resetCounter,
  getCounterValue,
} from '../../src/utils/counters.js';

beforeEach(() => {
  resetCounters();
});

describe('nextId', () => {
  it('returns sequential numbers starting at 1', () => {
    expect(nextId('test')).toBe(1);
    expect(nextId('test')).toBe(2);
    expect(nextId('test')).toBe(3);
  });

  it('maintains separate counters for different keys', () => {
    expect(nextId('users')).toBe(1);
    expect(nextId('presets')).toBe(1);
    expect(nextId('users')).toBe(2);
    expect(nextId('votes')).toBe(1);
    expect(nextId('presets')).toBe(2);
  });

  it('handles many increments', () => {
    for (let i = 0; i < 100; i++) {
      nextId('counter');
    }
    expect(nextId('counter')).toBe(101);
  });
});

describe('nextStringId', () => {
  it('returns prefixed sequential IDs', () => {
    expect(nextStringId('user')).toBe('user-1');
    expect(nextStringId('user')).toBe('user-2');
    expect(nextStringId('user')).toBe('user-3');
  });

  it('uses prefix as counter key', () => {
    expect(nextStringId('preset')).toBe('preset-1');
    expect(nextStringId('vote')).toBe('vote-1');
    expect(nextStringId('preset')).toBe('preset-2');
  });

  it('handles various prefixes', () => {
    expect(nextStringId('discord')).toBe('discord-1');
    expect(nextStringId('xivauth')).toBe('xivauth-1');
    expect(nextStringId('test-item')).toBe('test-item-1');
  });
});

describe('resetCounters', () => {
  it('resets all counters', () => {
    nextId('a');
    nextId('a');
    nextId('b');

    resetCounters();

    expect(nextId('a')).toBe(1);
    expect(nextId('b')).toBe(1);
  });

  it('allows fresh counting after reset', () => {
    for (let i = 0; i < 10; i++) {
      nextId('test');
    }

    resetCounters();

    expect(nextId('test')).toBe(1);
  });
});

describe('resetCounter', () => {
  it('resets a specific counter', () => {
    nextId('keep');
    nextId('keep');
    nextId('reset');
    nextId('reset');

    resetCounter('reset');

    expect(nextId('reset')).toBe(1);
    expect(nextId('keep')).toBe(3);
  });

  it('handles non-existent counter', () => {
    expect(() => resetCounter('nonexistent')).not.toThrow();
    expect(nextId('nonexistent')).toBe(1);
  });
});

describe('getCounterValue', () => {
  it('returns current counter value', () => {
    nextId('test');
    nextId('test');
    nextId('test');

    expect(getCounterValue('test')).toBe(3);
  });

  it('returns 0 for uninitialized counter', () => {
    expect(getCounterValue('never-used')).toBe(0);
  });

  it('does not increment the counter', () => {
    nextId('check');
    nextId('check');

    getCounterValue('check');
    getCounterValue('check');
    getCounterValue('check');

    expect(getCounterValue('check')).toBe(2);
  });
});
