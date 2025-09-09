import { clearCredentials } from '../features/auth/authSlice';
import { clearAuth } from '../features/auth/utils/persistence';

type BaseQueryResult = {
  data?: unknown;
  error?: { status?: number; data?: unknown };
};
type BaseQueryFn = (
  args: unknown,
  api: { dispatch: (a: unknown) => void },
  extraOptions: unknown
) => Promise<BaseQueryResult>;

export function createUnauthorizedWrapper(
  baseQuery: BaseQueryFn,
  predicate: (err: unknown) => boolean,
  onUnauthorized?: () => void
): BaseQueryFn {
  return async (args, api, extra) => {
    const result = await baseQuery(args, api, extra);
    if (
      result &&
      'error' in result &&
      result.error &&
      predicate(result.error)
    ) {
      api.dispatch(clearCredentials());
      try {
        clearAuth(window.localStorage);
      } catch (_e) {
        void _e; // ignore persistence errors
      }
      if (onUnauthorized) onUnauthorized();
    }
    return result;
  };
}
