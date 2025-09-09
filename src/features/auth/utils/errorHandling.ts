type ErrorLike = { status?: number; data?: unknown };

// Returns true when auth should be cleared based on unauthorized responses
export function shouldClearAuthOnUnauthorized(
  err: ErrorLike | null | undefined
): boolean {
  if (!err || typeof err !== 'object') return false;
  return err.status === 401;
}
