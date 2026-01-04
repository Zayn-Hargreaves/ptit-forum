import { Card, CardContent } from "@shared/ui/card/card";
import {
  MessageSquare,
  BookOpen,
  Calculator,
  Calendar,
  TrendingUp,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Diễn đàn thảo luận",
    description:
      "Tham gia các box thảo luận theo khoa, môn học và sở thích. Đặt câu hỏi và nhận câu trả lời từ cộng đồng.",
  },
  {
    icon: BookOpen,
    title: "Thư viện tài liệu",
    description:
      "Truy cập hàng trăm tài liệu học tập, slide bài giảng, đề thi được chia sẻ bởi sinh viên.",
  },
  {
    icon: Calculator,
    title: "Tính điểm GPA",
    description:
      "Công cụ tính GPA nhanh chóng và chính xác. Theo dõi kết quả học tập qua từng kỳ.",
  },
  {
    icon: Calendar,
    title: "Sự kiện & Hoạt động",
    description:
      "Cập nhật các sự kiện, hội thảo, workshop và hoạt động ngoại khóa của trường.",
  },
  {
    icon: TrendingUp,
    title: "Hệ thống danh tiếng",
    description:
      "Tích lũy điểm danh tiếng qua các đóng góp. Mở khóa quyền truy cập các box cao cấp.",
  },
  {
    icon: Shield,
    title: "An toàn & Bảo mật",
    description:
      "Hệ thống xác thực email sinh viên. Môi trường thảo luận được kiểm duyệt và an toàn.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Tất cả những gì bạn cần
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Một nền tảng tích hợp đầy đủ các công cụ hỗ trợ học tập và kết nối
            sinh viên
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="border-2 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
