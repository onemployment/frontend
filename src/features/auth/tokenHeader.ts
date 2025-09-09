export function attachAuthHeader(
  headers: Headers,
  token?: string | null
): void {
  if (token && token.trim() !== '') {
    headers.set('Authorization', `Bearer ${token}`);
  }
}
