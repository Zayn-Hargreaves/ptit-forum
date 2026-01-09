export const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/announcements', label: 'Thông báo' },
  { href: '/forum', label: 'Diễn đàn' },
  { href: '/documents', label: 'Tài liệu' },
  { href: '/cpa', label: 'Tính CPA' },
] as const;

export function isActiveRoute(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
