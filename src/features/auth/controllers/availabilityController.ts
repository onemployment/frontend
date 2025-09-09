type EmailFetcher = (
  email: string
) => Promise<{ available: boolean; message: string; retryAfter?: number }>;
type UsernameFetcher = (username: string) => Promise<{
  available: boolean;
  message: string;
  suggestions?: string[];
  retryAfter?: number;
}>;

export async function checkEmailAvailability(
  fetcher: EmailFetcher,
  email: string
): Promise<{ available: boolean; message: string }> {
  try {
    const res = await fetcher(email);
    return { available: res.available, message: res.message };
  } catch (err: unknown) {
    const e = err as { status?: number; data?: { retryAfter?: number } };
    if (e?.status === 429) {
      const secs = e?.data?.retryAfter ?? 0;
      return {
        available: false,
        message: `Too many requests. Please try again in ${secs}s`,
      };
    }
    return { available: false, message: 'Validation failed' };
  }
}

export async function checkUsernameAvailability(
  fetcher: UsernameFetcher,
  username: string
): Promise<{ available: boolean; message: string; suggestions?: string[] }> {
  try {
    const res = await fetcher(username);
    return {
      available: res.available,
      message: res.message,
      suggestions: res.suggestions,
    };
  } catch (err: unknown) {
    const e = err as { status?: number; data?: { retryAfter?: number } };
    if (e?.status === 429) {
      const secs = e?.data?.retryAfter ?? 0;
      return {
        available: false,
        message: `Too many requests. Please try again in ${secs}s`,
      };
    }
    return { available: false, message: 'Validation failed' };
  }
}
