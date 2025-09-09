export type ValidationDetail = { field: string; message: string };
export type FieldErrorMap = Record<string, string[]>;

export function collectFieldErrors(
  details: ValidationDetail[] | null | undefined
): FieldErrorMap {
  const map: FieldErrorMap = {};
  if (!Array.isArray(details)) return map;
  for (const d of details) {
    if (!d || typeof d.field !== 'string' || typeof d.message !== 'string')
      continue;
    if (!map[d.field]) map[d.field] = [];
    map[d.field].push(d.message);
  }
  return map;
}

export function getFirstFieldError(
  field: string,
  map: FieldErrorMap
): string | undefined {
  const list = map[field];
  return Array.isArray(list) && list.length > 0 ? list[0] : undefined;
}
