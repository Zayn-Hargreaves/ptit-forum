import { topicApi } from '@entities/topic/api/topic-api';
import { TopicDetailView } from './topic-detail-view';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { topicId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let topic = null;

  try {
    console.log("🚀 Start fetching Topic in TopicDetailPage...");
    topic = await topicApi.getById(topicId, accessToken);
    console.log(`✅ Fetched topic: ${topic.title}`);
  } catch (error: any) {
     console.error('❌ Failed to fetch topic in TopicDetailPage:', {
      message: error.message,
      code: error.code,
      url: error.config?.baseURL + error.config?.url
    });
  }

  if (!topic) {
    notFound();
  }

  // Inject ID manually if it's missing in TopicDetail but available from params
  // Although we expect getById to return it or we use params
  // But for the View, we pass topicId explicitly
  
  return <TopicDetailView topic={topic} topicId={topicId} />;
}
