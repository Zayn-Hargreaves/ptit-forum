import { ICategory } from '@entities/category/model/types';
import { CategoryGrid } from '@entities/category/ui/category-grid';
import { ForumSidebar } from '@shared/components/forum/forum-sidebar';
import { TopicDiscovery } from '@widgets/topic-discovery/ui/topic-discovery';
import { HomeHero } from '@widgets/home-hero/ui/home-hero';

interface ForumClientViewProps {
    initialCategories: ICategory[];
}

export function ForumClientView({ initialCategories }: Readonly<ForumClientViewProps>) {
    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <HomeHero />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                      <div className="space-y-10">
                        {/* Categories Section (Secondary -> Moved to Primary) */}
                        <div className="pb-8 border-b">
                            <h2 className="text-xl font-semibold mb-4">Danh mục chủ đề</h2>
                            <CategoryGrid categories={initialCategories} />
                        </div>

                        {/* Topic Feed Section (Main Content) */}
                        <TopicDiscovery />
                      </div>
                </div>
                
                <div className="hidden lg:block lg:col-span-1">
                    <ForumSidebar />
                </div>
            </div>
        </div>
    );
}

