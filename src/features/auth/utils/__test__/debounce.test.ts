import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// TDD: util not implemented yet
import { debounce } from '../debounce';

describe('debounce (TDD)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes function once after delay', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('collapses rapid calls into the last one', () => {
    const fn = vi.fn();
    const d = debounce(fn, 200);
    d('a');
    vi.advanceTimersByTime(100);
    d('b');
    vi.advanceTimersByTime(100);
    d('c');
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith('c');
  });
});
