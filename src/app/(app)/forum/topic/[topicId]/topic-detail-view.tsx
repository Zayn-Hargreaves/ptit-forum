'use client';

import { TopicDetail } from '@entities/topic/model/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { TopicHeader } from '@entities/topic/ui/topic-header';
import { PostList } from '@shared/components/forum/post-list';
import { TopicMembers } from '@entities/topic/ui/topic-members';
import { CreatePostDialog } from '@features/post/create-post/ui/create-post-dialog';

interface TopicDetailViewProps {
  topic: TopicDetail;
  topicId: string; // Needed for keying
}

export function TopicDetailView({ topic, topicId }: Readonly<TopicDetailViewProps>) {
  const { isTopicManager } = topic.currentUserContext || {};

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <TopicHeader topic={topic} />

      <Tabs defaultValue="discussion" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="discussion">Thảo luận</TabsTrigger>
            <TabsTrigger value="members">Thành viên</TabsTrigger>
            {isTopicManager && <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>}
          </TabsList>
          
           {/* Pass topicId to CreatePostDialog if possible, or context */}
           {/* Current CreatePostDialog might need props to pre-select topic */}
           <CreatePostDialog defaultTopicId={topicId} /> 
        </div>

        <TabsContent value="discussion" className="space-y-4">
           {/* PostList for this topic (Approved) */}
           <PostList 
              topicId={topicId} 
              fetchMode="topic"
           />
        </TabsContent>

        <TabsContent value="members">
           <TopicMembers topicId={topicId} isTopicManager={isTopicManager} />
        </TabsContent>

        {isTopicManager && (
          <TabsContent value="pending">
             <PostList 
                topicId={topicId} 
                fetchMode="pending"
             />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
