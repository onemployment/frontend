// Client-side helpers (non-authoritative; backend is source of truth)

export function isValidEmail(email: string): boolean {
  const value = String(email).trim();
  // Simple but practical email regex for client-side checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return value.length > 0 && value.length <= 255 && emailRegex.test(value);
}

export function isValidUsername(username: string): boolean {
  const value = String(username).trim();
  if (value.length === 0 || value.length > 39) return false;
  // Must start/end with alphanumeric; middle can include hyphens
  const pattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  if (!pattern.test(value)) return false;
  // No consecutive hyphens
  if (value.includes('--')) return false;
  return true;
}

export function isValidPassword(password: string): boolean {
  const value = String(password);
  // At least 8 chars, one lowercase, one uppercase, one digit
  const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return complexity.test(value) && value.length <= 100;
}

export function isValidName(name: string): boolean {
  const value = String(name).trim();
  if (value.length === 0 || value.length > 100) return false;
  const pattern = /^[a-zA-Z\s\-'.]+$/;
  return pattern.test(value);
}
