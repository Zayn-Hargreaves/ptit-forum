'use client';

import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { useQuery } from '@tanstack/react-query';
import { Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { topicApi } from '@/entities/topic/api/topic-api';

export function ForumSidebar() {
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics', 'popular'],
    queryFn: () => topicApi.getTopics(),
    select: (data) => {
      // Sort by approvedPostCount (descending) and take top 8
      // Show all topics, even those with 0 posts
      return data.sort((a, b) => (b.postCount || 0) - (a.postCount || 0)).slice(0, 8);
    },
  });

  return (
    <div className="space-y-6">
      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="text-primary h-5 w-5" />
            Topic phổ biến
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted h-7 w-24 animate-pulse rounded-full" />
              ))}
            </div>
          ) : topics.length === 0 ? (
            <p className="text-muted-foreground text-sm">Chưa có topic nào</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Link key={topic.id} href={`/forum/topic/${topic.id}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  >
                    {topic.name} ({topic.postCount})
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forum Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="text-primary h-5 w-5" />
            Quy định diễn đàn
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>• Tôn trọng và lịch sự với mọi người</p>
          <p>• Không spam hoặc quảng cáo</p>
          <p>• Đăng đúng topic và sử dụng ngôn ngữ phù hợp</p>
          <p>• Không chia sẻ thông tin cá nhân</p>
          <Link href="/rules" className="text-primary mt-2 inline-block hover:underline">
            Xem đầy đủ quy định →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
