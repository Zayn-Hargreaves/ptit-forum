import { ITopic } from '@entities/topic/model/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card/card';

interface TopicHeaderProps {
  topic: ITopic;
}

export function TopicHeader({ topic }: TopicHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{topic.name}</CardTitle>
            <CardDescription className="mt-2">{topic.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            {/* Extended Logic: Join/Leave buttons could go here */}
            {/* For now just placeholder or existing logic integration */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-gray-500">
          {/* Additional info like CreatedAt, Member Count etc */}
          <span>Created: {new Date(topic.createdAt || '').toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
