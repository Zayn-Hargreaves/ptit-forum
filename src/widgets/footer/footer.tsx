import { Globe, GraduationCap, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <GraduationCap className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">PTIT Forum</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Nền tảng kết nối và chia sẻ tri thức dành cho sinh viên Học viện Công nghệ Bưu chính
              Viễn thông.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/forum" className="text-muted-foreground hover:text-primary">
                  Diễn đàn
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-muted-foreground hover:text-primary">
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary">
                  Sự kiện
                </Link>
              </li>
              <li>
                <Link href="/gpa" className="text-muted-foreground hover:text-primary">
                  Tính GPA
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-muted-foreground hover:text-primary">
                  Góp ý / Báo lỗi
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-muted-foreground hover:text-primary">
                  Quy định cộng đồng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Liên hệ</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>forum@ptit.edu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(024) 3577 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <Link href="#" className="hover:text-primary">
                  Facebook Page
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} PTIT Forum. Học viện Công nghệ Bưu chính Viễn thông.</p>
        </div>
      </div>
    </footer>
  );
}
