"use client";

import { CreatePostDialog } from "@features/post/create-post/ui/create-post-dialog";

export default function ForumPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 space-y-8">
      {/* 1. Header Section: Title & Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Diễn đàn thảo luận
          </h1>
          <p className="text-muted-foreground mt-1">
            Nơi trao đổi, hỏi đáp và chia sẻ kiến thức của sinh viên PTIT.
          </p>
        </div>

        {/* Nút "Tạo bài viết" nằm trong Dialog này */}
        <CreatePostDialog />
      </div>

      {/* 2. Main Content Area (Phase 5 sẽ làm List bài viết ở đây) */}
      <div className="grid gap-6">
        {/* Placeholder tạm thời để layout không bị trống */}
        <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/10 p-8 text-center animate-in fade-in-50">
          <div className="max-w-md space-y-2">
            <h3 className="text-lg font-semibold">
              Chưa có bài viết nào hiển thị
            </h3>
            <p className="text-sm text-muted-foreground">
              Phase 5: Chúng ta sẽ implement Infinite Scroll & Post List tại
              đây. Hiện tại hãy tập trung test nút "Tạo bài viết" ở trên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
