import { ICategory } from '@entities/category/model/types';
import { CategoryGrid } from '@entities/category/ui/category-grid';
import { ForumSidebar } from '@shared/components/forum/forum-sidebar';
import { HomeHero } from '@widgets/home-hero/ui/home-hero';
import { TopicDiscovery } from '@widgets/topic-discovery/ui/topic-discovery';

interface ForumClientViewProps {
  initialCategories: ICategory[];
}

export function ForumClientView({ initialCategories }: Readonly<ForumClientViewProps>) {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <HomeHero />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="space-y-10">
            {/* Categories Section (Secondary -> Moved to Primary) */}
            <div className="border-b pb-8">
              <h2 className="mb-4 text-xl font-semibold">Danh mục chủ đề</h2>
              <CategoryGrid categories={initialCategories} />
            </div>

            {/* Topic Feed Section (Main Content) */}
            <TopicDiscovery />
          </div>
        </div>

        <div className="hidden lg:col-span-1 lg:block">
          <ForumSidebar />
        </div>
      </div>
    </div>
  );
}
