import { cookies } from 'next/headers'; // Thư viện của Next.js
import { topicApi } from '@entities/topic/api/topic-api';
import { ForumClientView } from './forum-client-view';
import { Topic } from '@entities/topic/model/types';

export const dynamic = 'force-dynamic';

export default async function ForumPage() {
  let topics: Topic[] = [];

  const cookieStore = await cookies();
  const allCookies = cookieStore.toString();

  try {
    const pageResponse = await topicApi.getAll(allCookies);
    topics = pageResponse?.content ?? [];
  } catch (error) {
    console.error('Failed to fetch topics:', error);
  }

  return <ForumClientView initialTopics={topics} />;
}
