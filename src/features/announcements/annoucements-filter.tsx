"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";
import { Checkbox } from "@shared/ui/checkbox/checkbox";
import { Label } from "@shared/ui/label/label";
import { Button } from "@shared/ui/button/button";
import {
  AnnouncementType,
  ANNOUNCEMENT_TYPE_LABEL,
} from "@entities/announcement/model/types";

export function AnnouncementsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = useCallback(
    (type: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentTypes = params.getAll("type");

      if (currentTypes.includes(type)) {
        params.delete("type");
        currentTypes
          .filter((t) => t !== type)
          .forEach((t) => params.append("type", t));
      } else {
        params.append("type", type);
      }

      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const clearFilters = () => {
    router.push("/announcements");
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-base">Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Loại thông báo</Label>
          <div className="space-y-2">
            {Object.values(AnnouncementType).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={searchParams.getAll("type").includes(type)}
                  onCheckedChange={() => handleTypeChange(type)}
                />
                <label
                  htmlFor={type}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {ANNOUNCEMENT_TYPE_LABEL[type]}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Phần Khoa/Viện: Nếu BE chưa có filter theo Khoa cho Public API -> Ẩn đi hoặc Comment lại chờ update */}

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={clearFilters}
        >
          Xóa bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
}
