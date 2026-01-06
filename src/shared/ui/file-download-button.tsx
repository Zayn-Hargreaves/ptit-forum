'use client';

import { Button } from '@shared/ui/button/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FileDownloadButtonProps {
  fileUrl: string;
  fileName: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
}

export const FileDownloadButton = ({ fileUrl, fileName, variant = 'outline' }: FileDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Avoid triggering parent clicks

    try {
      setIsDownloading(true);

      // 1. Fetch file from Firebase as Blob
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();

      // 2. Create Object URL
      const url = window.URL.createObjectURL(blob);

      // 3. Create hidden anchor and click
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // Force download with name
      document.body.appendChild(link);
      link.click();

      // 4. Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Đã bắt đầu tải xuống');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Không thể tải file. Vui lòng thử lại sau.');
      // Fallback: Open in new tab
      window.open(fileUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size="sm" 
      onClick={handleDownload} 
      disabled={isDownloading}
      className="gap-2"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isDownloading ? 'Đang tải...' : 'Tải về'}
    </Button>
  );
};
