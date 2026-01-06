'use client';

import { cn } from '@shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Button } from '@shared/ui/button/button';
import { Camera, Loader2, Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  fallbackName: string;
  className?: string;
  disabled?: boolean;
  onFileSelect?: (file: File | null) => void;
}

export function AvatarUploader({
  currentAvatarUrl,
  fallbackName,
  className,
  disabled = false,
  onFileSelect,
}: Readonly<AvatarUploaderProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const initials = useMemo(() => {
    const parts = fallbackName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return parts
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }, [fallbackName]);

  const handleTriggerClick = () => {
    if (disabled || isProcessing) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)');
      return;
    }

    setIsProcessing(true);

    // Revoke old preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Emit file to parent
    if (onFileSelect) {
      onFileSelect(file);
    }

    setIsProcessing(false);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displaySrc = previewUrl || currentAvatarUrl;

  return (
    <div className={cn('group relative inline-block', className)}>
      <Avatar className="border-background relative h-24 w-24 overflow-hidden border-4 shadow-xl sm:h-32 sm:w-32">
        {isProcessing && (
          <div className="animate-in fade-in absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 text-white">
            <Loader2 className="mb-1 h-8 w-8 animate-spin" />
            <span className="text-xs font-bold">Processing...</span>
          </div>
        )}

        <AvatarImage
          src={displaySrc}
          alt={fallbackName}
          className={cn(
            'object-cover transition-opacity duration-300',
            isProcessing && 'opacity-50 blur-[1px]',
          )}
        />
        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold sm:text-3xl">
          {initials}
        </AvatarFallback>

        <button
          type="button"
          onClick={handleTriggerClick}
          disabled={disabled || isProcessing}
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center rounded-full transition-opacity duration-200',
            disabled || isProcessing
              ? 'hidden'
              : 'cursor-pointer bg-black/30 opacity-0 group-hover:opacity-100',
          )}
        >
          <Camera className="h-8 w-8 text-white/90 drop-shadow-md" />
        </button>
      </Avatar>

      <Button
        size="icon"
        variant="secondary"
        className="absolute right-0 bottom-0 z-30 h-8 w-8 rounded-full shadow-lg sm:h-10 sm:w-10"
        onClick={handleTriggerClick}
        disabled={disabled || isProcessing}
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
