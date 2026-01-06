import { TopicContentTabs } from '@widgets/topic-content-tabs/ui/topic-content-tabs';
import { TopicHeaderSection } from '@widgets/topic-header-section/ui/topic-header-section';
import { TopicSidebar } from '@widgets/topic-sidebar/ui/topic-sidebar';

interface PageProps {
  params: Promise<{
    topicId: string;
  }>;
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { topicId } = await params;

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* 1. Header Widget */}
      <TopicHeaderSection topicId={topicId} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* 2. Main Content (Tabs: Feed / Members / Management) - Chiếm 8 cột */}
        <div className="lg:col-span-8">
          <TopicContentTabs topicId={topicId} />
        </div>

        {/* 3. Sidebar - Chiếm 4 cột */}
        <div className="hidden space-y-6 lg:col-span-4 lg:block">
          <TopicSidebar topicId={topicId} />
        </div>
      </div>
    </div>
  );
}
