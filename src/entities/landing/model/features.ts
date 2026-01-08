import { BookOpen, Calculator, Calendar, MessageSquare, Shield, TrendingUp } from 'lucide-react';

export const LANDING_FEATURES = [
  {
    icon: MessageSquare,
    title: 'Diễn đàn thảo luận',
    description:
      'Tham gia các box thảo luận theo khoa, môn học và sở thích. Đặt câu hỏi và nhận câu trả lời từ cộng đồng.',
  },
  {
    icon: BookOpen,
    title: 'Thư viện tài liệu',
    description:
      'Truy cập hàng trăm tài liệu học tập, slide bài giảng, đề thi được chia sẻ bởi sinh viên.',
  },
  {
    icon: Calculator,
    title: 'Tính điểm GPA',
    description: 'Công cụ tính GPA nhanh chóng và chính xác. Theo dõi kết quả học tập qua từng kỳ.',
  },
  {
    icon: Calendar,
    title: 'Sự kiện & Hoạt động',
    description: 'Cập nhật các sự kiện, hội thảo, workshop và hoạt động ngoại khóa của trường.',
  },
  {
    icon: TrendingUp,
    title: 'Hệ thống danh tiếng',
    description:
      'Tích lũy điểm danh tiếng qua các đóng góp. Mở khóa quyền truy cập các box cao cấp.',
  },
  {
    icon: Shield,
    title: 'An toàn & Bảo mật',
    description:
      'Hệ thống xác thực email sinh viên. Môi trường thảo luận được kiểm duyệt và an toàn.',
  },
] as const;
