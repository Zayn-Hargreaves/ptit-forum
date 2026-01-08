'use client';

import { DailyPostChart } from '@features/admin/dashboard/ui/daily-post-chart';
import { LatestAnnouncementsTable } from '@features/admin/dashboard/ui/latest-announcements-table';
import { MonthlyPostChart } from '@features/admin/dashboard/ui/monthly-post-chart';
import { TopPostsTable } from '@features/admin/dashboard/ui/top-posts-table';
import { TopTopicsTable } from '@features/admin/dashboard/ui/top-topics-table';
import { useEffect, useState } from 'react';

import { AnnouncementResponse } from '@/entities/announcement/model/types';
import { IPost, PostStatDTO } from '@/entities/post/model/types';
import { ITopic } from '@/entities/topic/model/types';
import { announcementApi } from '@/shared/api/announcement.service';
import { postApi } from '@/shared/api/post.service';
import { topicApi } from '@/shared/api/topic.service';

export default function DashboardPage() {
  const [latestAnnouncements, setLatestAnnouncements] = useState<AnnouncementResponse[]>([]);
  const [topPosts, setTopPosts] = useState<IPost[]>([]);
  const [dailyStats, setDailyStats] = useState<PostStatDTO[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<PostStatDTO[]>([]);
  const [topTopics, setTopTopics] = useState<ITopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, topPostsRes, dailyStatsRes, monthlyStatsRes, topTopicsRes] =
          await Promise.all([
            announcementApi.getLatest(),
            postApi.getTopReacted(),
            postApi.getDailyStats(),
            postApi.getMonthlyStats(),
            topicApi.getTopMembers(),
          ]);

        setLatestAnnouncements(announcementsRes || []);
        setTopPosts(topPostsRes || []);
        setDailyStats(dailyStatsRes || []);
        setMonthlyStats(monthlyStatsRes || []);
        setTopTopics(topTopicsRes || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <DailyPostChart data={dailyStats} />
        </div>
        <div className="col-span-3">
          <MonthlyPostChart data={monthlyStats} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TopPostsTable posts={topPosts} />
        <TopTopicsTable topics={topTopics} />
        <LatestAnnouncementsTable announcements={latestAnnouncements} />
      </div>
    </div>
  );
}
