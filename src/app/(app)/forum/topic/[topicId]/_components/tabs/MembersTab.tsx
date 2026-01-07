"use client";

import { useQuery } from "@tanstack/react-query";
import { topicMemberApi } from "@entities/topic/api/topic-member-api";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Skeleton } from "@shared/ui/skeleton/skeleton";
import { Badge } from "@shared/ui/badge/badge";
import { Crown, Shield } from "lucide-react";
import { getRoleLabel, getRoleBadgeVariant, isLeadershipRole, type TopicRole } from "@features/topic-moderation/lib/permission-utils";

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
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: true, page: 0, size: 100 })
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
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
          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-amber-200">
            <Crown className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-700">Ban Quản Trị</h3>
          </div>
          <div className="space-y-3 p-3 bg-amber-50/30 rounded-lg border border-amber-100">
            {leadership.map((member: any) => (
              <div key={member.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.user?.avatarUrl || member.avatarUrl} />
                  <AvatarFallback>{(member.user?.fullName || member.fullName)?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{member.user?.fullName || member.fullName}</div>
                    <RoleBadge role={member.topicRole} />
                  </div>
                  <div className="text-sm text-muted-foreground">{member.user?.email || member.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Members Section */}
      {regularMembers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-gray-200">
            <span className="text-lg">👥</span>
            <h3 className="font-semibold text-gray-700">Thành viên ({regularMembers.length})</h3>
          </div>
          <div className="space-y-3">
            {regularMembers.map((member: any) => (
              <div key={member.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.user?.avatarUrl || member.avatarUrl} />
                  <AvatarFallback>{(member.user?.fullName || member.fullName)?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{member.user?.fullName || member.fullName}</div>
                  <div className="text-sm text-muted-foreground">{member.user?.email || member.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
