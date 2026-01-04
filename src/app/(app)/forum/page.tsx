"use client";
import { Button } from "@shared/ui/button/button";

export default function ForumPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Forum Dashboard</h1>
      <p className="text-muted-foreground">
        Nếu nhìn thấy dòng này nghĩa là Token Refresh đã hoạt động và Route
        không bị crash.
      </p>

      <div className="p-4 border rounded bg-slate-50">
        <h2 className="font-semibold">Test Area</h2>
        {/* Nút này để test xem tương tác có bị lỗi không */}
        <Button onClick={() => alert("It works!")}>Click Me</Button>
      </div>
    </div>
  );
}
