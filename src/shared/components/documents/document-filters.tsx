import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Checkbox } from '@shared/ui/checkbox/checkbox';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select/select';
import { Select } from 'react-day-picker';
import { Label } from 'recharts';

export function DocumentFilters() {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-base">Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Faculty Filter */}
        <div className="space-y-2">
          <Label>Khoa</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="cntt">Công nghệ thông tin</SelectItem>
              <SelectItem value="dtvt">Điện tử viễn thông</SelectItem>
              <SelectItem value="kttt">Kinh tế - Tin học</SelectItem>
              <SelectItem value="khmt">Khoa học máy tính</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Semester Filter */}
        <div className="space-y-2">
          <Label>Kỳ học</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="1">Kỳ 1</SelectItem>
              <SelectItem value="2">Kỳ 2</SelectItem>
              <SelectItem value="3">Kỳ 3</SelectItem>
              <SelectItem value="4">Kỳ 4</SelectItem>
              <SelectItem value="5">Kỳ 5</SelectItem>
              <SelectItem value="6">Kỳ 6</SelectItem>
              <SelectItem value="7">Kỳ 7</SelectItem>
              <SelectItem value="8">Kỳ 8</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subject Filter */}
        <div className="space-y-2">
          <Label>Môn học</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="oop">Lập trình hướng đối tượng</SelectItem>
              <SelectItem value="dsa">Cấu trúc dữ liệu & Giải thuật</SelectItem>
              <SelectItem value="db">Cơ sở dữ liệu</SelectItem>
              <SelectItem value="network">Mạng máy tính</SelectItem>
              <SelectItem value="os">Hệ điều hành</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Document Type */}
        <div className="space-y-3">
          <Label>Loại tài liệu</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="slides" />
              <label
                htmlFor="slides"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Slide bài giảng
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="exercises" />
              <label
                htmlFor="exercises"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bài tập
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="exams" />
              <label
                htmlFor="exams"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Đề thi
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="notes" />
              <label
                htmlFor="notes"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ghi chú
              </label>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Sắp xếp</Label>
          <Select defaultValue="newest">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
              <SelectItem value="downloads">Nhiều lượt tải</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          Xóa bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
}
