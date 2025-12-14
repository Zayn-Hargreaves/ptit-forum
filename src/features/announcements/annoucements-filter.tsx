import { Button } from "@shared/ui/button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { Checkbox } from "@shared/ui/checkbox/checkbox";
import { Label } from "@shared/ui/label/label";

export function AnnouncementsFilter() {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-base">Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Loại thông báo</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="hocvu" defaultChecked />
              <label
                htmlFor="hocvu"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Học vụ
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="hocbong" />
              <label
                htmlFor="hocbong"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Học bổng
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="clb" />
              <label
                htmlFor="clb"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                CLB & Hoạt động
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="tuyendung" />
              <label
                htmlFor="tuyendung"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tuyển dụng
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="khac" />
              <label
                htmlFor="khac"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Khác
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Khoa</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="all-faculty" defaultChecked />
              <label
                htmlFor="all-faculty"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tất cả
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cntt" />
              <label
                htmlFor="cntt"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Công nghệ thông tin
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dtvt" />
              <label
                htmlFor="dtvt"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Điện tử viễn thông
              </label>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          Xóa bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
}
