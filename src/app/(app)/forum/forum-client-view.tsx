'use client';

import { useState } from 'react';
import { CreatePostDialog } from '@features/post/create-post/ui/create-post-dialog';
import { PostList } from '@shared/components/forum/post-list';
import { PostFilter } from '@features/post/feed/ui/post-filter';
import { SortMode, TimeRange } from '@entities/post/model/use-infinite-posts';
import { Topic } from '@entities/topic/model/types';

interface ForumClientViewProps {
    initialTopics: Topic[];
}

export function ForumClientView({ initialTopics }: Readonly<ForumClientViewProps>) {
    const [sortMode, setSortMode] = useState<SortMode>('latest');
    const [timeRange, setTimeRange] = useState<TimeRange>('week');
    const [topicId, setTopicId] = useState<string | null>(null);

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Diễn đàn</h1>
                    <p className="text-muted-foreground mt-1">Nơi trao đổi kiến thức...</p>
                </div>
                <CreatePostDialog />
            </div>

            <div className="grid gap-6">
                <PostFilter
                    sortMode={sortMode}
                    onSortChange={setSortMode}
                    timeRange={timeRange}
                    onTimeChange={setTimeRange}
                    topics={initialTopics}
                    selectedTopic={topicId}
                    onTopicChange={setTopicId}
                />

                <PostList sortMode={sortMode} timeRange={timeRange} topicId={topicId} />
            </div>
        </div>
    );
}
