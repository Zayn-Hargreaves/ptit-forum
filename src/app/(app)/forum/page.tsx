import { categoryApi } from '@entities/category/api/category-api';
import { ICategory } from '@entities/category/model/types';
import { cookies } from 'next/headers';

import { ForumClientView } from './forum-client-view';

export const dynamic = 'force-dynamic';

export default async function ForumPage() {
  let categories: ICategory[] = [];
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  try {
    console.log('🚀 Start fetching categories in ForumPage...');
    categories = await categoryApi.getAll(accessToken);
    console.log(`✅ Fetched ${categories.length} categories`);
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      code?: string;
      config?: { baseURL?: string; url?: string };
    };
    console.error('❌ Failed to fetch categories on Server:', {
      message: err.message,
      code: err.code,
      url: err.config?.baseURL ?? '' + (err.config?.url ?? ''),
    });
  }

  return <ForumClientView initialCategories={categories} />;
}
