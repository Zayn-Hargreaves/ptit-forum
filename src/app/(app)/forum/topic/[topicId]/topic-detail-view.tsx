'use client';

import { Topic } from '@entities/topic/model/types';
import { TopicHeader } from '@entities/topic/ui/topic-header';
import { TopicMembers } from '@entities/topic/ui/topic-members';
import { CreatePostDialog } from '@features/post/create-post/ui/create-post-dialog';
import { PostList } from '@shared/components/forum/post-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';

interface TopicDetailViewProps {
  topic: Topic;
  topicId: string; // Needed for keying
}

export function TopicDetailView({ topic, topicId }: Readonly<TopicDetailViewProps>) {
  const topicManager = topic.currentUserContext?.topicManager || false;

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <TopicHeader topic={topic} />

      <Tabs defaultValue="discussion" className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="discussion">Thảo luận</TabsTrigger>
            <TabsTrigger value="members">Thành viên</TabsTrigger>
            {topicManager && <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>}
          </TabsList>

          {/* Pass topicId to CreatePostDialog if possible, or context */}
          {/* Current CreatePostDialog might need props to pre-select topic */}
          <CreatePostDialog defaultTopicId={topicId} />
        </div>

        <TabsContent value="discussion" className="space-y-4">
          {/* PostList for this topic (Approved) */}
          <PostList topicId={topicId} fetchMode="topic" />
        </TabsContent>

        <TabsContent value="members">
          <TopicMembers topicId={topicId} topicManager={topicManager} />
        </TabsContent>

        {topicManager && (
          <TabsContent value="pending">
            <PostList topicId={topicId} fetchMode="pending" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
