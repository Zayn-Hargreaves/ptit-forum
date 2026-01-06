'use client';

import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function EventsCalendar() {
  const daysInMonth = 30;
  const firstDayOfWeek = 5;
  const today = 15;

  const events = [
    { day: 20, title: 'Hội thảo AI', color: 'bg-blue-500' },
    { day: 22, title: 'Workshop React', color: 'bg-green-500' },
    { day: 25, title: 'Ngày hội việc làm', color: 'bg-purple-500' },
    { day: 28, title: 'Hackathon', color: 'bg-orange-500' },
  ];

  const getEventsForDay = (day: number) => {
    return events.filter((event) => event.day === day);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tháng 11, 2024</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <div
                key={day}
                className="text-muted-foreground p-2 text-center text-sm font-semibold"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = day === today;

              return (
                <div
                  key={day}
                  className={`min-h-20 rounded-lg border p-2 ${
                    isToday ? 'border-primary bg-primary/5' : 'border-border'
                  } ${dayEvents.length > 0 ? 'hover:border-primary/50 cursor-pointer' : ''}`}
                >
                  <div className={`mb-1 text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className={`rounded px-1 py-0.5 text-xs text-white ${event.color}`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chú thích</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-sm">Hội thảo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span className="text-sm">Workshop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-purple-500" />
            <span className="text-sm">Nghề nghiệp</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-orange-500" />
            <span className="text-sm">Cuộc thi</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
