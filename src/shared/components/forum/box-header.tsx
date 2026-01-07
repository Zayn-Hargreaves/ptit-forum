import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent } from '@shared/ui/card/card';
import { Bell, BellOff, MessageSquare, Users } from 'lucide-react';

export function BoxHeader({ boxId: _boxId }: { boxId: string }) {
  // Mock data - would fetch based on boxId
  const box = {
    name: 'Lập trình & Thuật toán',
    description: 'Thảo luận về lập trình, giải thuật, và các ngôn ngữ lập trình',
    icon: '💻',
    posts: 456,
    members: 2340,
    category: 'Học tập',
    isSubscribed: false,
  };

  return (
    <Card className="mb-6 border-2">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{box.icon}</div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-2xl font-bold">{box.name}</h1>
                <Badge variant="outline">{box.category}</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{box.description}</p>
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{box.posts} bài viết</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{box.members} thành viên</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant={box.isSubscribed ? 'outline' : 'default'}>
            {box.isSubscribed ? (
              <>
                <BellOff className="mr-2 h-4 w-4" />
                Bỏ theo dõi
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Theo dõi
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
