export function parsePage(page?: string | string[]): number {
  if (Array.isArray(page)) return 1;
  const parsed = Number(page);
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

export function parseString(param?: string | string[]): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}
