'use client';

import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import {
  getRoleBadgeVariant,
  getRoleLabel,
  isLeadershipRole,
  type TopicRole,
} from '@features/topic-moderation/lib/permission-utils';
import { Badge } from '@shared/ui/badge/badge';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { Crown, Shield } from 'lucide-react';

export interface TabProps {
  topicId: string;
}

const RoleBadge = ({ role }: { role: string }) => {
  const typedRole = role as TopicRole;
  const variant = getRoleBadgeVariant(typedRole);
  const label = getRoleLabel(typedRole);

  return (
    <Badge variant={variant} className="gap-1">
      {role === 'OWNER' && <Crown className="h-3 w-3" />}
      {role === 'MANAGER' && <Shield className="h-3 w-3" />}
      {label}
    </Badge>
  );
};

export function MembersTab({ topicId }: TabProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['members', topicId, 'approved'],
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: true, page: 0, size: 100 }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return <div className="text-muted-foreground p-4">Không có thành viên nào.</div>;
  }

  const members = data.content;
  const leadership = members.filter((m) => isLeadershipRole(m.topicRole as TopicRole));
  const regularMembers = members.filter((m) => !isLeadershipRole(m.topicRole as TopicRole));

  return (
    <div className="space-y-6">
      {/* Leadership Section */}
      {leadership.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 border-b-2 border-amber-200 pb-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-700">Ban Quản Trị</h3>
          </div>
          <div className="space-y-3 rounded-lg border border-amber-100 bg-amber-50/30 p-3">
            {leadership.map(
              (member: {
                id: string;
                fullName?: string;
                avatarUrl?: string;
                topicRole: string;
                email?: string;
              }) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 rounded-lg border bg-white p-3"
                >
                  <UserAvatar
                    name={member.fullName}
                    avatarUrl={member.avatarUrl}
                    className="h-10 w-10"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{member.fullName}</div>
                      <RoleBadge role={member.topicRole} />
                    </div>
                    <div className="text-muted-foreground text-sm">{member.email}</div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Regular Members Section */}
      {regularMembers.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
            <span className="text-lg">👥</span>
            <h3 className="font-semibold text-gray-700">Thành viên ({regularMembers.length})</h3>
          </div>
          <div className="space-y-3">
            {regularMembers.map(
              (member: {
                id: string;
                fullName?: string;
                avatarUrl?: string;
                topicRole: string;
                email?: string;
              }) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 rounded-lg border bg-white p-3 transition-shadow hover:shadow-sm"
                >
                  <UserAvatar
                    name={member.fullName}
                    avatarUrl={member.avatarUrl}
                    className="h-10 w-10"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{member.fullName}</div>
                    <div className="text-muted-foreground text-sm">{member.email}</div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
