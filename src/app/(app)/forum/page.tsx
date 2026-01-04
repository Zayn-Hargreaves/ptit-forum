import { cookies } from 'next/headers'; // Thư viện của Next.js
import { topicApi } from '@entities/topic/api/topic-api';
import { ForumClientView } from './forum-client-view';
import { Topic } from '@entities/topic/model/types';

export const dynamic = 'force-dynamic';

export default async function ForumPage() {
  let topics: Topic[] = [];

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  try {
    const pageResponse = await topicApi.getAll(accessToken);
    topics = pageResponse?.content ?? [];
  } catch (error: any) {
    // Suppress 401 errors on Server Side since we don't have cookies yet (Auth Transition)
    if (error?.response?.status !== 401) {
      console.error('Failed to fetch topics:', error);
    }
  }

  return <ForumClientView initialTopics={topics} />;
}
