"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Camera, Loader2, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useFileUpload } from "@shared/hooks/use-file-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Button } from "@shared/ui/button/button";
import { cn } from "@shared/lib/utils";

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  fallbackName: string;
  className?: string;
  disabled?: boolean;
}

export function AvatarUploader({
  currentAvatarUrl,
  fallbackName,
  className,
  disabled = false,
}: Readonly<AvatarUploaderProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { upload, isUploading, progress } = useFileUpload({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => {
      setPreviewUrl(null);
    },
    validate: {
      maxSizeMB: 5,
      acceptedTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const initials = useMemo(() => {
    const parts = fallbackName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }, [fallbackName]);

  const handleTriggerClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    await upload(file, "/users/profile", "PUT", "image");

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displaySrc = previewUrl || currentAvatarUrl;

  return (
    <div className={cn("relative group inline-block", className)}>
      <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl relative overflow-hidden">
        {isUploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 text-white animate-in fade-in">
            <Loader2 className="h-8 w-8 animate-spin mb-1" />
            <span className="text-xs font-bold">{progress}%</span>
          </div>
        )}

        <AvatarImage
          src={displaySrc}
          alt={fallbackName}
          className={cn(
            "object-cover transition-opacity duration-300",
            isUploading && "opacity-50 blur-[1px]"
          )}
        />
        <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>

        <button
          type="button"
          onClick={handleTriggerClick}
          disabled={disabled || isUploading}
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-200 z-10",
            disabled || isUploading
              ? "hidden"
              : "bg-black/30 opacity-0 group-hover:opacity-100 cursor-pointer"
          )}
        >
          <Camera className="h-8 w-8 text-white/90 drop-shadow-md" />
        </button>
      </Avatar>

      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 rounded-full shadow-lg h-8 w-8 sm:h-10 sm:w-10 z-30"
        onClick={handleTriggerClick}
        disabled={disabled || isUploading}
      >
        <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileSelect}
      />
    </div>
  );
}
