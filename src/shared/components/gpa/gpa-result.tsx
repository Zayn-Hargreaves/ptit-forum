import { Button } from "@shared/ui/button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { Progress } from "@shared/ui/progress/progress";
import { Save, Share2 } from "lucide-react";

interface GPAResultProps {
  gpa: number;
  totalCredits: number;
}

export function GPAResult({ gpa, totalCredits }: GPAResultProps) {
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.6) return "text-green-600 dark:text-green-400";
    if (gpa >= 3.2) return "text-blue-600 dark:text-blue-400";
    if (gpa >= 2.5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGPALabel = (gpa: number) => {
    if (gpa >= 3.6) return "Xuất sắc";
    if (gpa >= 3.2) return "Giỏi";
    if (gpa >= 2.5) return "Khá";
    if (gpa >= 2.0) return "Trung bình";
    return "Yếu";
  };

  return (
    <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle>Kết quả</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="mb-2 text-sm text-muted-foreground">GPA của bạn</div>
          <div className={`text-6xl font-bold ${getGPAColor(gpa)}`}>
            {gpa.toFixed(2)}
          </div>
          <div className="mt-2 text-lg font-semibold text-muted-foreground">
            {getGPALabel(gpa)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tiến độ</span>
            <span className="font-medium">
              {((gpa / 4.0) * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={(gpa / 4.0) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg border bg-background p-4">
          <div>
            <div className="text-sm text-muted-foreground">Tổng tín chỉ</div>
            <div className="text-2xl font-bold">{totalCredits}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Điểm trung bình</div>
            <div className="text-2xl font-bold">{gpa.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Save className="mr-2 h-4 w-4" />
            Lưu kết quả
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Share2 className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
