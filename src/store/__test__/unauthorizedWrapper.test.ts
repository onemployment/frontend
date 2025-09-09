import { describe, it, expect, vi } from 'vitest';

// TDD: target module not implemented yet
import { createUnauthorizedWrapper } from '../unauthorizedWrapper';
import { shouldClearAuthOnUnauthorized } from '../../features/auth/utils/errorHandling';

type Result = { data?: unknown; error?: { status?: number; data?: unknown } };

const fakeBaseQuery = async (result: Result) => async (): Promise<Result> =>
  result;

describe('createUnauthorizedWrapper (TDD)', () => {
  it('invokes onUnauthorized when predicate matches (401)', async () => {
    const base = await fakeBaseQuery({
      error: { status: 401, data: { error: 'TOKEN_EXPIRED' } },
    });
    const onUnauthorized = vi.fn();
    const wrapped = createUnauthorizedWrapper(
      base,
      shouldClearAuthOnUnauthorized as (err: unknown) => boolean,
      onUnauthorized
    );

    const res = await wrapped({}, { dispatch: () => {} }, undefined);
    expect(res).toEqual({
      error: { status: 401, data: { error: 'TOKEN_EXPIRED' } },
    });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onUnauthorized for non-401 errors', async () => {
    const base = await fakeBaseQuery({
      error: { status: 429, data: { error: 'RATE_LIMIT_EXCEEDED' } },
    });
    const onUnauthorized = vi.fn();
    const wrapped = createUnauthorizedWrapper(
      base,
      shouldClearAuthOnUnauthorized as (err: unknown) => boolean,
      onUnauthorized
    );

    await wrapped({}, { dispatch: () => {} }, undefined);
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('passes through successful responses unchanged', async () => {
    const payload = { ok: true };
    const base = await fakeBaseQuery({ data: payload });
    const onUnauthorized = vi.fn();
    const wrapped = createUnauthorizedWrapper(
      base,
      shouldClearAuthOnUnauthorized as (err: unknown) => boolean,
      onUnauthorized
    );

    const res = await wrapped({}, { dispatch: () => {} }, undefined);
    expect(res).toEqual({ data: payload });
    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});
