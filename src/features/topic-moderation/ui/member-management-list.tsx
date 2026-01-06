'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicMemberApi, TopicMemberResponse } from '@entities/topic/api/topic-member-api';
import { useTopicRole } from '@entities/topic/model/use-topic-role';
import { Button } from '@shared/ui/button/button';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { Check, X, Crown, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@shared/ui/badge/badge';
import { MemberActionMenu } from './member-action-menu';
import { getRoleLabel, getRoleBadgeVariant, isLeadershipRole, type TopicRole } from '../lib/permission-utils';

interface MemberManagementListProps {
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

const MemberCard = ({
  member,
  viewerRole,
  onApprove,
  onReject,
  onRemove,
  onChangeRole,
  isPending,
  showActions = true,
}: {
  member: TopicMemberResponse;
  viewerRole: TopicRole;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRemove?: (id: string) => void;
  onChangeRole?: (id: string, newRole: 'MANAGER' | 'MEMBER') => void;
  isPending: boolean;
  showActions?: boolean;
}) => {
  const roleIcon = member.topicRole === 'OWNER' ? '👑' : member.topicRole === 'MANAGER' ? '🛡️' : '👤';

  return (
    <div className="flex items-start justify-between p-4 border rounded-lg bg-background shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.user?.avatarUrl || (member as any).avatarUrl} />
          <AvatarFallback>{(member.user?.fullName || (member as any).fullName)?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">{roleIcon}</span>
            <h4 className="font-semibold">{member.user?.fullName || (member as any).fullName}</h4>
            {member.approved && <RoleBadge role={member.topicRole} />}
          </div>
          <div className="text-sm text-muted-foreground">{member.user?.email || (member as any).email}</div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true, locale: vi })}
          </div>
        </div>
      </div>
      {showActions && (
        <div className="flex items-center gap-2">
          {!member.approved ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                title="Duyệt"
                disabled={isPending}
                onClick={() => onApprove?.(member.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Từ chối"
                disabled={isPending}
                onClick={() => onReject?.(member.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <MemberActionMenu
              viewerRole={viewerRole}
              targetRole={member.topicRole as TopicRole}
              targetMemberId={member.id}
              targetMemberName={member.user?.fullName || (member as any).fullName}
              onRemove={onRemove!}
              onChangeRole={onChangeRole}
              disabled={isPending}
            />
          )}
        </div>
      )}
    </div>
  );
};

const GroupedMemberList = ({
  members,
  viewerRole,
  onRemove,
  onChangeRole,
  isPending,
}: {
  members: TopicMemberResponse[];
  viewerRole: TopicRole;
  onRemove: (id: string) => void;
  onChangeRole?: (id: string, newRole: 'MANAGER' | 'MEMBER') => void;
  isPending: boolean;
}) => {
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
            {leadership.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                viewerRole={viewerRole}
                onRemove={onRemove}
                onChangeRole={onChangeRole}
                isPending={isPending}
              />
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
            {regularMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                viewerRole={viewerRole}
                onRemove={onRemove}
                onChangeRole={onChangeRole}
                isPending={isPending}
              />
            ))}
          </div>
        </div>
      )}

      {leadership.length === 0 && regularMembers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground italic">Chưa có thành viên</div>
      )}
    </div>
  );
};

export function MemberManagementList({ topicId }: MemberManagementListProps) {
  const queryClient = useQueryClient();
  const { role: viewerRole } = useTopicRole(topicId);

  const { data: pendingMembers, isLoading: loadingPending } = useQuery({
    queryKey: ['members', topicId, 'pending'],
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: false, page: 0, size: 20 }),
  });

  const { data: approvedMembers, isLoading: loadingApproved } = useQuery({
    queryKey: ['members', topicId, 'approved'],
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: true, page: 0, size: 50 }),
  });

  const approveMutation = useMutation({
    mutationFn: (memberId: string) => topicMemberApi.approveMember(memberId),
    onSuccess: () => {
      toast.success('Đã duyệt thành viên');
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'approved'] });
    },
    onError: () => toast.error('Lỗi khi duyệt thành viên'),
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => topicMemberApi.removeMember(memberId),
    onSuccess: () => {
      toast.success('Đã xóa thành viên');
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'approved'] });
    },
    onError: () => toast.error('Lỗi khi xóa thành viên'),
  });

  const isPending = approveMutation.isPending || removeMutation.isPending;

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="pending">
          Chờ duyệt
          {pendingMembers && pendingMembers.content.length > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
              {pendingMembers.content.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="approved">
          Đã duyệt
          {approvedMembers && approvedMembers.content.length > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">({approvedMembers.content.length})</span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        {loadingPending ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : !pendingMembers || pendingMembers.content.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground italic">
            Không có thành viên nào chờ duyệt
          </div>
        ) : (
          <div className="space-y-3">
            {pendingMembers.content.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                viewerRole={viewerRole as TopicRole}
                onApprove={approveMutation.mutate}
                onReject={removeMutation.mutate}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="approved">
        {loadingApproved ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : !approvedMembers || approvedMembers.content.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground italic">Chưa có thành viên</div>
        ) : (
          <GroupedMemberList
            members={approvedMembers.content}
            viewerRole={viewerRole as TopicRole}
            onRemove={removeMutation.mutate}
            isPending={isPending}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
