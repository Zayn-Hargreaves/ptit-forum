'use client';

import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Input } from '@shared/ui/input/input';
import { Label } from '@shared/ui/label/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select/select';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { GPAResult } from './gpa-result';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'B+': 3.5,
  B: 3.0,
  'C+': 2.5,
  C: 2.0,
  'D+': 1.5,
  D: 1.0,
  F: 0.0,
};

export function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([{ id: '1', name: '', credits: 3, grade: '' }]);
  const [gpa, setGpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number>(0);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', credits: 3, grade: '' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(
      courses.map((course) => (course.id === id ? { ...course, [field]: value } : course)),
    );
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCreds = 0;

    courses.forEach((course) => {
      if (course.grade && course.credits > 0) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCreds += course.credits;
      }
    });

    if (totalCreds > 0) {
      setGpa(totalPoints / totalCreds);
      setTotalCredits(totalCreds);
    }
  };

  const resetCalculator = () => {
    setCourses([{ id: '1', name: '', credits: 3, grade: '' }]);
    setGpa(null);
    setTotalCredits(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nhập điểm các môn học</CardTitle>
          <CardDescription>Thêm các môn học và điểm số để tính GPA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses.map((course, _index) => (
            <div key={course.id} className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`course-${course.id}`} className="sr-only">
                  Tên môn học
                </Label>
                <Input
                  id={`course-${course.id}`}
                  placeholder="Tên môn học"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                />
              </div>
              <div className="w-24 space-y-2">
                <Label htmlFor={`credits-${course.id}`} className="sr-only">
                  Tín chỉ
                </Label>
                <Input
                  id={`credits-${course.id}`}
                  type="number"
                  min="1"
                  max="6"
                  placeholder="TC"
                  value={course.credits}
                  onChange={(e) =>
                    updateCourse(course.id, 'credits', Number.parseInt(e.target.value))
                  }
                />
              </div>
              <div className="w-28 space-y-2">
                <Label htmlFor={`grade-${course.id}`} className="sr-only">
                  Điểm
                </Label>
                <Select
                  value={course.grade}
                  onValueChange={(value) => updateCourse(course.id, 'grade', value)}
                >
                  <SelectTrigger id={`grade-${course.id}`}>
                    <SelectValue placeholder="Điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+ (4.0)</SelectItem>
                    <SelectItem value="A">A (4.0)</SelectItem>
                    <SelectItem value="B+">B+ (3.5)</SelectItem>
                    <SelectItem value="B">B (3.0)</SelectItem>
                    <SelectItem value="C+">C+ (2.5)</SelectItem>
                    <SelectItem value="C">C (2.0)</SelectItem>
                    <SelectItem value="D+">D+ (1.5)</SelectItem>
                    <SelectItem value="D">D (1.0)</SelectItem>
                    <SelectItem value="F">F (0.0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCourse(course.id)}
                disabled={courses.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addCourse}
            className="w-full bg-transparent"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm môn học
          </Button>

          <div className="flex gap-2">
            <Button onClick={calculateGPA} className="flex-1">
              <Calculator className="mr-2 h-4 w-4" />
              Tính GPA
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              Làm mới
            </Button>
          </div>
        </CardContent>
      </Card>

      {gpa !== null && <GPAResult gpa={gpa} totalCredits={totalCredits} />}
    </div>
  );
}
