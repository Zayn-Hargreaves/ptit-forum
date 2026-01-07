'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { topicApi } from '@entities/topic/api/topic-api';
import { TopicCard } from '@entities/topic/ui/topic-card';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { AlertCircle } from 'lucide-react';

export const TopicDiscovery = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: topics, isLoading, isError } = useQuery({
    queryKey: ['topics', query], 
    queryFn: () => topicApi.getTopics({ search: query }),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
             <Skeleton className="h-[125px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Đã có lỗi xảy ra</h3>
            <p className="text-muted-foreground">Không thể tải danh sách chủ đề. Vui lòng thử lại sau.</p>
        </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-lg border border-dashed">
        <p className="text-muted-foreground text-lg">
            {query ? `Không tìm thấy chủ đề nào khớp với "${query}"` : 'Chưa có chủ đề nào được tạo'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
            {query ? `Kết quả tìm kiếm: "${query}"` : 'Cộng đồng nổi bật'}
        </h2>
        <span className="text-muted-foreground text-sm">{topics.length} kết quả</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
};
