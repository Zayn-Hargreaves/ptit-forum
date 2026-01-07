import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Lock, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';

const forumBoxes = [
  {
    id: 1,
    name: 'Học vụ & Đăng ký học phần',
    description: 'Thông tin về đăng ký học phần, lịch thi, kết quả học tập',
    icon: '📚',
    posts: 234,
    members: 1520,
    isPrivate: false,
    minLevel: 1,
    category: 'Học tập',
  },
  {
    id: 2,
    name: 'Lập trình & Thuật toán',
    description: 'Thảo luận về lập trình, giải thuật, và các ngôn ngữ lập trình',
    icon: '💻',
    posts: 456,
    members: 2340,
    isPrivate: false,
    minLevel: 1,
    category: 'Học tập',
  },
  {
    id: 3,
    name: 'Cơ sở dữ liệu',
    description: 'SQL, NoSQL, thiết kế database và tối ưu hóa',
    icon: '🗄️',
    posts: 189,
    members: 890,
    isPrivate: false,
    minLevel: 1,
    category: 'Học tập',
  },
  {
    id: 4,
    name: 'Mạng máy tính',
    description: 'Networking, protocols, security và infrastructure',
    icon: '🌐',
    posts: 167,
    members: 756,
    isPrivate: false,
    minLevel: 1,
    category: 'Học tập',
  },
  {
    id: 5,
    name: 'Thực tập & Nghề nghiệp',
    description: 'Chia sẻ kinh nghiệm thực tập, phỏng vấn và tìm việc',
    icon: '💼',
    posts: 312,
    members: 1890,
    isPrivate: false,
    minLevel: 1,
    category: 'Nghề nghiệp',
  },
  {
    id: 6,
    name: 'Học bổng & Cơ hội',
    description: 'Thông tin về học bổng, cuộc thi, và các cơ hội phát triển',
    icon: '🎓',
    posts: 145,
    members: 1234,
    isPrivate: false,
    minLevel: 1,
    category: 'Cơ hội',
  },
  {
    id: 7,
    name: 'CLB & Hoạt động',
    description: 'Các câu lạc bộ, sự kiện và hoạt động ngoại khóa',
    icon: '🎭',
    posts: 278,
    members: 1567,
    isPrivate: false,
    minLevel: 1,
    category: 'Sinh hoạt',
  },
  {
    id: 8,
    name: 'Giải trí & Tâm sự',
    description: 'Nơi chia sẻ những câu chuyện đời thường và giải trí',
    icon: '🎮',
    posts: 523,
    members: 2890,
    isPrivate: false,
    minLevel: 1,
    category: 'Giải trí',
  },
  {
    id: 9,
    name: 'VIP - Thảo luận nâng cao',
    description: 'Box dành cho thành viên có danh tiếng cao',
    icon: '⭐',
    posts: 89,
    members: 234,
    isPrivate: true,
    minLevel: 5,
    category: 'Đặc biệt',
  },
];

const categories = [
  'Tất cả',
  'Học tập',
  'Nghề nghiệp',
  'Cơ hội',
  'Sinh hoạt',
  'Giải trí',
  'Đặc biệt',
];

export function ForumBoxes() {
  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === 'Tất cả' ? 'default' : 'outline'}
              className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              {category}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* Forum Boxes */}
      <div className="space-y-4">
        {forumBoxes.map((box) => (
          <Link key={box.id} href={`/forum/box/${box.id}`}>
            <Card className="hover:border-primary/50 transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{box.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="hover:text-primary text-lg">{box.name}</CardTitle>
                        {box.isPrivate && <Lock className="text-muted-foreground h-4 w-4" />}
                      </div>
                      <CardDescription className="mt-1">{box.description}</CardDescription>
                      <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{box.posts} bài viết</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{box.members} thành viên</span>
                        </div>
                        {box.minLevel > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            Yêu cầu Level {box.minLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{box.category}</Badge>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
