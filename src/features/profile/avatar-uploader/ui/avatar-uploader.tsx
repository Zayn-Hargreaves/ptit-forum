"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Button } from "@shared/ui/button/button";
import { cn } from "@shared/lib/utils";
import { validateImage } from "@shared/lib/file";

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  fallbackName: string;
  className?: string;

  value?: File | null;
  onChange: (file: File | null) => void;

  disabled?: boolean;
}

export function AvatarUploader({
  currentAvatarUrl,
  fallbackName,
  className,
  value = null,
  onChange,
  disabled = false,
}: Readonly<AvatarUploaderProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const initials = useMemo(() => {
    const parts = fallbackName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }, [fallbackName]);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [value]);

  const handleTriggerClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    try {
      if (!file) return;
      validateImage(file);
      onChange(file);
    } catch (error: any) {
      toast.error(error?.message || "File không hợp lệ");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(null);
  };

  const displaySrc = previewUrl || currentAvatarUrl;

  return (
    <div className={cn("relative group inline-block", className)}>
      <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl">
        <AvatarImage
          src={displaySrc}
          alt={fallbackName}
          className="object-cover"
        />
        <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>

        <button
          type="button"
          aria-label="Chọn ảnh đại diện"
          onClick={handleTriggerClick}
          disabled={disabled}
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-200",
            disabled
              ? "opacity-0 cursor-not-allowed"
              : "bg-black/30 opacity-0 group-hover:opacity-100 cursor-pointer"
          )}
        >
          <Camera className="h-8 w-8 text-white/90 drop-shadow-md" />
        </button>
      </Avatar>

      {value ? (
        <Button
          size="icon"
          variant="destructive"
          className="absolute bottom-0 right-0 rounded-full shadow-lg h-8 w-8 sm:h-10 sm:w-10"
          onClick={handleRemoveFile}
          disabled={disabled}
          aria-label="Bỏ ảnh đã chọn"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full shadow-lg h-8 w-8 sm:h-10 sm:w-10"
          onClick={handleTriggerClick}
          disabled={disabled}
          aria-label="Chọn ảnh"
        >
          <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileSelect}
      />
    </div>
  );
}
