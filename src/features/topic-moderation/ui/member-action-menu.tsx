'use client';

import { MoreHorizontal, ShieldCheck, ShieldAlert, UserMinus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu/dropdown-menu';
import { Button } from '@shared/ui/button/button';
import { canManageMember, canChangeRole, type TopicRole } from '../lib/permission-utils';
import { useState } from 'react';

interface MemberActionMenuProps {
  viewerRole: TopicRole;
  targetRole: TopicRole;
  targetMemberId: string;
  targetMemberName?: string;
  onRemove: (id: string) => void;
  onChangeRole?: (id: string, newRole: 'MANAGER' | 'MEMBER') => void;
  disabled?: boolean;
}

export function MemberActionMenu({
  viewerRole,
  targetRole,
  targetMemberId,
  targetMemberName,
  onRemove,
  onChangeRole,
  disabled = false,
}: MemberActionMenuProps) {
  const [open, setOpen] = useState(false);

  // 🛡️ CRITICAL: Only show menu if viewer can manage target
  if (!canManageMember(viewerRole, targetRole)) {
    return null;
  }

  const handleRemove = () => {
    const memberName = targetMemberName || 'thành viên này';
    if (confirm(`Bạn có chắc muốn mời ${memberName} ra khỏi nhóm?`)) {
      onRemove(targetMemberId);
      setOpen(false);
    }
  };

  const handlePromote = () => {
    if (onChangeRole) {
      onChangeRole(targetMemberId, 'MANAGER');
      setOpen(false);
    }
  };

  const handleDemote = () => {
    if (onChangeRole) {
      const memberName = targetMemberName || 'quản trị viên này';
      if (confirm(`Bạn có chắc muốn giáng chức ${memberName} xuống thành viên thường?`)) {
        onChangeRole(targetMemberId, 'MEMBER');
        setOpen(false);
      }
    }
  };

  const canChange = canChangeRole(viewerRole);
  const isTargetManager = targetRole === 'MANAGER';
  const isTargetMember = targetRole === 'MEMBER';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={disabled}>
          <span className="sr-only">Mở menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>

        {/* Role Change Actions (Owner only) */}
        {canChange && onChangeRole && (
          <>
            {isTargetMember && (
              <DropdownMenuItem onClick={handlePromote}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Thăng chức Manager
              </DropdownMenuItem>
            )}
            {isTargetManager && (
              <DropdownMenuItem onClick={handleDemote}>
                <ShieldAlert className="mr-2 h-4 w-4" />
                Giáng chức xuống Member
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Remove Action */}
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleRemove}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          Mời ra khỏi nhóm
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
