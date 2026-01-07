import { categoryApi } from '@entities/category/api/category-api';
import { ICategory } from '@entities/category/model/types';
import { topicApi } from '@entities/topic/api/topic-api';
import { ITopic } from '@entities/topic/model/types';
import { cookies } from 'next/headers';

import { CategoryDetailView } from './category-detail-view';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { categoryId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let topics: ITopic[] = [];
  let category: ICategory | null = null;

  try {
    console.log('🚀 Start fetching Data in CategoryDetailPage...');
    // Parallel fetch
    const [topicsData, categoryData] = await Promise.all([
      topicApi.getByCategory(categoryId, accessToken),
      categoryApi.getOne(categoryId, accessToken),
    ]);

    topics = topicsData ?? [];
    category = categoryData;
    console.log(`✅ Fetched ${topics.length} topics`);
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      code?: string;
      config?: { baseURL?: string; url?: string };
    };
    console.error('❌ Failed to fetch data in CategoryDetailPage:', {
      message: err.message,
      code: err.code,
      url: err.config?.baseURL ?? '' + (err.config?.url ?? ''),
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
    category = { id: categoryId, name: 'Danh mục', slug: categoryId, description: '' };
  }

  return <CategoryDetailView topics={topics} category={category} />;
}
