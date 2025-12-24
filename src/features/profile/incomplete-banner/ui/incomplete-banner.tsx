"use client";

import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert/alert";
import { Button } from "@shared/ui/button/button";

interface IncompleteProfileBannerProps {
  onUpdateClick: () => void;
  isHidden?: boolean;
}

export function IncompleteProfileBanner({
  onUpdateClick,
  isHidden,
}: Readonly<IncompleteProfileBannerProps>) {
  if (isHidden) return null;

  return (
    <div className="mb-6">
      <Alert className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Hồ sơ chưa hoàn thiện</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>
            Bạn sẽ không nhận được thông báo lớp học nếu thiếu Mã SV/Lớp.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdateClick}
            className="shrink-0 bg-background hover:bg-yellow-100 dark:hover:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
          >
            Cập nhật ngay
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
