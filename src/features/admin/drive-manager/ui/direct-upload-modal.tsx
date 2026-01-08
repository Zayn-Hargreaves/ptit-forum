'use client';

import { Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { apiClient } from '@/shared/api/axios-client';
import { Button } from '@/shared/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog/dialog';
import { Input } from '@/shared/ui/input/input';
import { Label } from '@/shared/ui/label/label';

interface DirectUploadModalProps {
  onUploadSuccess?: () => void;
}

export function DirectUploadModal({ onUploadSuccess }: DirectUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiClient.post('/drive/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('File uploaded to Drive successfully');
      setIsOpen(false);
      setFile(null);
      onUploadSuccess?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file to Drive');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Direct Upload to Drive
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload to Google Drive</DialogTitle>
          <DialogDescription>
            Upload files directly to Google Drive. These files will not be stored in the internal
            system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input id="file" type="file" onChange={handleFileChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
