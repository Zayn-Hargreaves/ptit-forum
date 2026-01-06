import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import {
  AlertTriangle,
  Ban,
  FileText,
  Lock,
  MessageSquare,
  Shield,
  ThumbsUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center">
          <Shield className="text-primary h-12 w-12" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Quy định Diễn đàn PTIT</h1>
        <p className="text-muted-foreground">
          Để tạo nên một cộng đồng thân thiện và chuyên nghiệp, vui lòng tuân thủ các quy định sau
        </p>
      </div>

      <div className="space-y-6">
        {/* General Conduct */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="text-primary h-5 w-5" />
              1. Quy tắc Ứng xử Chung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">1.1. Tôn trọng lẫn nhau</h4>
              <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
                <li>Luôn lịch sự, tôn trọng ý kiến của người khác</li>
                <li>Không được xúc phạm, chửi bới, hoặc công kích cá nhân</li>
                <li>Tránh ngôn từ phân biệt chủng tộc, tôn giáo, giới tính</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">1.2. Nội dung bài viết</h4>
              <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
                <li>Sử dụng tiếng Việt có dấu, tránh viết tắt khó hiểu</li>
                <li>Tiêu đề rõ ràng, mô tả đúng nội dung bài viết</li>
                <li>Không đăng nội dung trùng lặp hoặc spam</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Content Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="text-primary h-5 w-5" />
              2. Hướng dẫn Đăng bài
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">2.1. Chọn đúng Topic</h4>
              <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
                <li>Đăng bài vào topic phù hợp với chủ đề</li>
                <li>Tìm kiếm trước khi tạo topic mới để tránh trùng lặp</li>
                <li>Nếu không chắc chắn, hỏi moderator trước khi đăng</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">2.2. Định dạng bài viết</h4>
              <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
                <li>Sử dụng markdown để định dạng văn bản cho dễ đọc</li>
                <li>Đính kèm code sử dụng code blocks với syntax highlighting</li>
                <li>Hình ảnh và file đính kèm phải liên quan đến nội dung</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Content */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Ban className="h-5 w-5" />
              3. Nội dung Cấm đăng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-destructive/10 rounded-lg p-4">
              <ul className="ml-6 list-disc space-y-2 text-sm">
                <li>
                  <strong>Spam và quảng cáo:</strong> Không đăng quảng cáo sản phẩm, dịch vụ không
                  liên quan
                </li>
                <li>
                  <strong>Thông tin sai lệch:</strong> Không lan truyền tin giả, thông tin chưa kiểm
                  chứng
                </li>
                <li>
                  <strong>Nội dung vi phạm pháp luật:</strong> Không chia sẻ tài liệu bản quyền, nội
                  dung đồi trụy
                </li>
                <li>
                  <strong>Thông tin cá nhân:</strong> Không chia sẻ số điện thoại, địa chỉ, CMND của
                  bản thân hoặc người khác
                </li>
                <li>
                  <strong>Tranh cãi chính trị:</strong> Tránh các chủ đề nhạy cảm về chính trị, tôn
                  giáo
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Topic Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary h-5 w-5" />
              4. Quản lý Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">4.1. Topic Công khai (Public)</h4>
              <p className="text-muted-foreground text-sm">
                Mọi người có thể xem và tham gia. Bài viết cần được duyệt bởi manager của topic.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">4.2. Topic Riêng tư (Private)</h4>
              <p className="text-muted-foreground text-sm">
                Chỉ thành viên được duyệt mới có thể xem và tham gia. Yêu cầu tham gia cần được
                manager phê duyệt.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">4.3. Quyền và trách nhiệm</h4>
              <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
                <li>
                  <Badge variant="outline" className="font-mono text-xs">
                    Creator
                  </Badge>
                  : Tạo topic, quản lý toàn bộ
                </li>
                <li>
                  <Badge variant="outline" className="font-mono text-xs">
                    Manager
                  </Badge>
                  : Duyệt bài, quản lý thành viên
                </li>
                <li>
                  <Badge variant="outline" className="font-mono text-xs">
                    Member
                  </Badge>
                  : Đăng bài, bình luận, react
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="text-primary h-5 w-5" />
              5. Bảo mật và Quyền riêng tư
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="text-muted-foreground ml-6 list-disc space-y-2 text-sm">
              <li>Không chia sẻ mật khẩu hoặc thông tin đăng nhập của bạn</li>
              <li>Báo cáo ngay nếu phát hiện hành vi đáng ngờ hoặc vi phạm</li>
              <li>Bảo vệ thông tin cá nhân của bản thân và người khác</li>
              <li>Không sử dụng tài khoản của người khác</li>
            </ul>
            <p className="text-muted-foreground text-sm">
              Lưu ý: &ldquo;Ptit Forum&rdquo; là một dự án &ldquo;phi lợi nhuận&rdquo; nhằm hỗ trợ
              cộng đồng sinh viên.
            </p>
          </CardContent>
        </Card>

        {/* Consequences */}
        <Card className="border-amber-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              6. Xử lý Vi phạm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 rounded-lg bg-amber-500/10 p-4">
              <p className="text-sm">
                Tùy vào mức độ vi phạm, ban quản trị có thể áp dụng các hình thức xử lý sau:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-sm">
                <li>
                  <strong>Cảnh cáo:</strong> Nhắc nhở lần đầu
                </li>
                <li>
                  <strong>Xóa bài viết:</strong> Gỡ nội dung vi phạm
                </li>
                <li>
                  <strong>Tạm khóa:</strong> Hạn chế quyền đăng bài trong thời gian nhất định
                </li>
                <li>
                  <strong>Khóa vĩnh viễn:</strong> Vi phạm nghiêm trọng hoặc tái phạm nhiều lần
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" />
              7. Liên hệ và Hỗ trợ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Nếu bạn có câu hỏi hoặc cần báo cáo vi phạm, vui lòng liên hệ:
            </p>
            <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
              <li>Gửi tin nhắn cho moderator của topic</li>
              <li>Sử dụng chức năng &ldquo;Báo cáo&rdquo; trên bài viết vi phạm</li>
              <li>Email: support@ptit-forum.edu.vn (demo)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="bg-muted/50 mt-8 rounded-lg border p-6 text-center">
          <p className="text-muted-foreground text-sm">
            &quot;Chơi đẹp&quot; và &quot;Học thật&quot; là tôn chỉ của diễn đàn. Bằng việc sử dụng
            diễn đàn, bạn đồng ý tuân thủ các quy định trên.
            <br />
            Ban quản trị có quyền cập nhật quy định mà không cần thông báo trước.
          </p>
          <p className="text-muted-foreground mt-4 text-xs">Cập nhật lần cuối: Tháng 1, 2026</p>
          <div className="mt-4">
            <Link href="/forum" className="text-primary text-sm font-medium hover:underline">
              ← Quay lại Diễn đàn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
