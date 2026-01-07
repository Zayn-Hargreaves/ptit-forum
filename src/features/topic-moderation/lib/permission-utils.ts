/**
 * Permission utilities for topic member management
 * Implements role hierarchy to prevent unauthorized actions
 */

export type TopicRole = 'OWNER' | 'MANAGER' | 'MEMBER' | 'GUEST';

/**
 * Role hierarchy levels
 * Higher number = more authority
 */
export const ROLE_LEVELS: Record<TopicRole, number> = {
  OWNER: 3,
  MANAGER: 2,
  MEMBER: 1,
  GUEST: 0,
};

/**
 * Check if viewer can manage (remove, approve, change role) a target member
 * Rule: You can only manage members with LOWER level than yours
 *
 * @example
 * canManageMember('MANAGER', 'MEMBER') // true (2 > 1)
 * canManageMember('MANAGER', 'MANAGER') // false (2 = 2)
 * canManageMember('MANAGER', 'OWNER') // false (2 < 3)
 * canManageMember('OWNER', 'MANAGER') // true (3 > 2)
 */
export function canManageMember(viewerRole: TopicRole, targetRole: TopicRole): boolean {
  const viewerLevel = ROLE_LEVELS[viewerRole];
  const targetLevel = ROLE_LEVELS[targetRole];

  return viewerLevel > targetLevel;
}

/**
 * Check if viewer can change member roles (promote/demote)
 * Only OWNER can change roles
 */
export function canChangeRole(viewerRole: TopicRole): boolean {
  return viewerRole === 'OWNER';
}

/**
 * Check if a member should be protected from removal
 * OWNER cannot be removed
 */
export function isProtectedRole(role: TopicRole): boolean {
  return role === 'OWNER';
}

/**
 * Get Vietnamese label for role
 */
export function getRoleLabel(role: TopicRole): string {
  const labels: Record<TopicRole, string> = {
    OWNER: 'Chủ sở hữu',
    MANAGER: 'Quản trị viên',
    MEMBER: 'Thành viên',
    GUEST: 'Khách',
  };

  return labels[role] || role;
}

/**
 * Get Badge variant for role display
 */
export function getRoleBadgeVariant(
  role: TopicRole,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<TopicRole, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    OWNER: 'destructive',
    MANAGER: 'default',
    MEMBER: 'secondary',
    GUEST: 'outline',
  };

  return variants[role] || 'secondary';
}

/**
 * Check if role is leadership (OWNER or MANAGER)
 */
export function isLeadershipRole(role: TopicRole): boolean {
  return role === 'OWNER' || role === 'MANAGER';
}
