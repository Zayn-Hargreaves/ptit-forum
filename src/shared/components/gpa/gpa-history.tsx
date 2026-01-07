import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Calendar, TrendingUp } from 'lucide-react';

const semesters = [
  { id: 1, name: 'Kỳ 1 - 2023', gpa: 3.45, credits: 18, status: 'Hoàn thành' },
  { id: 2, name: 'Kỳ 2 - 2023', gpa: 3.62, credits: 20, status: 'Hoàn thành' },
  { id: 3, name: 'Kỳ 3 - 2024', gpa: 3.78, credits: 19, status: 'Hoàn thành' },
  { id: 4, name: 'Kỳ 4 - 2024', gpa: 0, credits: 0, status: 'Đang học' },
];

export function GPAHistory() {
  const completedSemesters = semesters.filter((s) => s.status === 'Hoàn thành');
  const totalGPA =
    completedSemesters.reduce((sum, s) => sum + s.gpa * s.credits, 0) /
    completedSemesters.reduce((sum, s) => sum + s.credits, 0);

  return (
    <div className="space-y-6">
      {/* Overall GPA */}
      <Card className="border-primary/20 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="text-primary h-5 w-5" />
            GPA tích lũy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-primary text-4xl font-bold">{totalGPA.toFixed(2)}</div>
            <div className="text-muted-foreground mt-1 text-sm">
              {completedSemesters.reduce((sum, s) => sum + s.credits, 0)} tín chỉ
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semester History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="text-primary h-5 w-5" />
            Lịch sử học tập
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {semesters.map((semester) => (
            <div key={semester.id} className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">{semester.name}</span>
                <Badge variant={semester.status === 'Hoàn thành' ? 'secondary' : 'default'}>
                  {semester.status}
                </Badge>
              </div>
              {semester.status === 'Hoàn thành' && (
                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <span>GPA: {semester.gpa.toFixed(2)}</span>
                  <span>{semester.credits} tín chỉ</span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mẹo học tập</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>• Tham gia đầy đủ các buổi học</p>
          <p>• Hoàn thành bài tập đúng hạn</p>
          <p>• Tham gia nhóm học tập</p>
          <p>• Ôn tập thường xuyên</p>
        </CardContent>
      </Card>
    </div>
  );
}
