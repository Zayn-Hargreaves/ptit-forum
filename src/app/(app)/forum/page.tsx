import { cookies } from 'next/headers';
import { categoryApi, Category } from '@entities/category/api/category-api';
import { ForumClientView } from './forum-client-view';

export const dynamic = 'force-dynamic';

export default async function ForumPage() {
  let categories: Category[] = [];
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  try {
    console.log("🚀 Start fetching categories in ForumPage...");
    categories = await categoryApi.getAll(accessToken);
    console.log(`✅ Fetched ${categories.length} categories`);
  } catch (error: any) {
    console.error('❌ Failed to fetch categories on Server:', {
      message: error.message,
      code: error.code, 
      url: error.config?.baseURL + error.config?.url 
    });
  }

  return <ForumClientView initialCategories={categories} />;
}
