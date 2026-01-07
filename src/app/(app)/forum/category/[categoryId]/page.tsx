import { topicApi } from '@entities/topic/api/topic-api';
import { categoryApi } from '@entities/category/api/category-api';
import { Topic } from '@entities/topic/model/types';
import { CategoryDetailView } from './category-detail-view';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { categoryId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let topics: Topic[] = [];
  let category: any = null; // using any temporarily or fetch proper type

  try {
    console.log("🚀 Start fetching Data in CategoryDetailPage...");
    // Parallel fetch
    const [topicsData, categoryData] = await Promise.all([
      topicApi.getByCategory(categoryId, accessToken),
      categoryApi.getOne(categoryId, accessToken)
    ]);
    
    topics = topicsData ?? [];
    category = categoryData;
    console.log(`✅ Fetched ${topics.length} topics`);
    
  } catch (error: any) {
    console.error('❌ Failed to fetch data in CategoryDetailPage:', {
      message: error.message,
      code: error.code,
      url: error.config?.baseURL + error.config?.url
    });
  }

  if (!category) {
    // If category not found, you might want to show not found or just a fallback
    // For now assuming if API fails entirely we might want to 404
      // or handle gracefully. Let's redirect to forum home if critical failure?
      // Or just render with empty/null and handle in View?
      // Better to 404 if category ID is invalid.
      // notFound(); 
      // But let's be safe and just pass what we have. API might throw 404.
  }

  // Workaround if getOne fails or returns null
  if (!category) {
      category = { id: categoryId, name: 'Danh mục', description: '' };
  }

  return <CategoryDetailView topics={topics} category={category} />;
}
