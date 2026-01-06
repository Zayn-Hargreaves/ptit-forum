'use client';

import { Topic } from '@entities/topic/model/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { useState } from 'react';

import { ApprovedPostsTab } from './tabs/ApprovedPostsTab';
import { JoinRequestsTab } from './tabs/JoinRequestsTab';
import { MembersTab } from './tabs/MembersTab';
import { PendingPostsTab } from './tabs/PendingPostsTab';
import { TopicHeader } from './TopicHeader';
import { useTopicPermission } from './useTopicPermission';

interface TopicDetailViewProps {
  topic: Topic;
}

export function TopicDetailView({ topic }: TopicDetailViewProps) {
  const [activeTab, setActiveTab] = useState('discussions');
  const { canManage } = useTopicPermission(topic);

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <TopicHeader topic={topic} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="discussions"
            className="data-[state=active]:bg-background data-[state=active]:border-primary rounded-none rounded-t-md shadow-none data-[state=active]:border-b-2"
          >
            Discussions
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-background data-[state=active]:border-primary rounded-none rounded-t-md shadow-none data-[state=active]:border-b-2"
          >
            Members
          </TabsTrigger>
          {canManage && (
            <>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-background data-[state=active]:border-primary rounded-none rounded-t-md shadow-none data-[state=active]:border-b-2"
              >
                Pending Posts
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-background data-[state=active]:border-primary rounded-none rounded-t-md shadow-none data-[state=active]:border-b-2"
              >
                Join Requests
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="discussions">
            <ApprovedPostsTab topicId={topic.id} />
          </TabsContent>

          <TabsContent value="members">
            {activeTab === 'members' && <MembersTab topicId={topic.id} />}
          </TabsContent>

          {canManage && (
            <>
              <TabsContent value="pending">
                {activeTab === 'pending' && <PendingPostsTab topicId={topic.id} />}
              </TabsContent>
              <TabsContent value="requests">
                {activeTab === 'requests' && <JoinRequestsTab topicId={topic.id} />}
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}
