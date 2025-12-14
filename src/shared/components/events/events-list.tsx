"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@shared/ui/card/card";
import { Badge } from "@shared/ui/badge/badge";
import { Button } from "@shared/ui/button/button";
import { Pagination } from "@shared/ui/pagination/pagination";

const events = [
  {
    id: 1,
    title: "Hội thảo Công nghệ AI và Machine Learning",
    description:
      "Tìm hiểu về xu hướng AI và ứng dụng thực tế trong doanh nghiệp",
    date: "2024-11-20",
    time: "14:00 - 16:00",
    location: "Hội trường A1",
    organizer: "Khoa CNTT",
    attendees: 156,
    maxAttendees: 200,
    category: "Hội thảo",
    status: "upcoming",
    image: "/ai-conference.png",
  },
  {
    id: 2,
    title: "Workshop: Phát triển ứng dụng với React & Next.js",
    description: "Học cách xây dựng ứng dụng web hiện đại với React và Next.js",
    date: "2024-11-22",
    time: "09:00 - 12:00",
    location: "Phòng Lab 301",
    organizer: "CLB Lập trình",
    attendees: 45,
    maxAttendees: 50,
    category: "Workshop",
    status: "upcoming",
    image: "/coding-workshop.png",
  },
  {
    id: 3,
    title: "Ngày hội việc làm PTIT 2024",
    description:
      "Gặp gỡ các nhà tuyển dụng hàng đầu và tìm kiếm cơ hội việc làm",
    date: "2024-11-25",
    time: "08:00 - 17:00",
    location: "Sân vận động",
    organizer: "Phòng Công tác sinh viên",
    attendees: 523,
    maxAttendees: 1000,
    category: "Nghề nghiệp",
    status: "upcoming",
    image: "/job-fair.png",
  },
  {
    id: 4,
    title: "Cuộc thi Hackathon 2024",
    description: "48 giờ coding marathon với giải thưởng hấp dẫn",
    date: "2024-11-28",
    time: "08:00 - 20:00",
    location: "Toà nhà B",
    organizer: "CLB Công nghệ",
    attendees: 89,
    maxAttendees: 100,
    category: "Cuộc thi",
    status: "upcoming",
    image: "/hackathon-event.png",
  },
];

interface EventsListProps {
  filter: "upcoming" | "past";
}

export function EventsList({ filter }: EventsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const filteredEvents = events.filter((event) => event.status === filter);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {paginatedEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="mb-3 flex items-start justify-between gap-2">
                <Badge variant="secondary">{event.category}</Badge>
                <Badge variant="outline" className="text-xs">
                  {event.attendees}/{event.maxAttendees} người
                </Badge>
              </div>

              <Link href={`/events/${event.id}`}>
                <h3 className="mb-2 text-xl font-semibold leading-tight hover:text-primary">
                  {event.title}
                </h3>
              </Link>
              <p className="mb-4 text-sm text-muted-foreground">
                {event.description}
              </p>

              <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.organizer}</span>
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/events/${event.id}`}>Đăng ký tham gia</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
