import { TopicHeaderSection } from '@widgets/topic-header-section/ui/topic-header-section';
import { TopicSidebar } from '@widgets/topic-sidebar/ui/topic-sidebar';
import { TopicContentTabs } from '@widgets/topic-content-tabs/ui/topic-content-tabs';

interface PageProps {
  params: Promise<{
    topicId: string;
  }>;
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { topicId } = await params;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* 1. Header Widget */}
      <TopicHeaderSection topicId={topicId} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Main Content (Tabs: Feed / Members / Management) - Chiếm 8 cột */}
        <div className="lg:col-span-8">
           <TopicContentTabs topicId={topicId} />
        </div>

        {/* 3. Sidebar - Chiếm 4 cột */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
           <TopicSidebar topicId={topicId} />
        </div>
      </div>
    </div>
  );
}
