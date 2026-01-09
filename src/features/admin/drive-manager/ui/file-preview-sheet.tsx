import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/shared/ui/sheet/sheet';
import { FileMetadata } from '../model/schema';

interface FilePreviewSheetProps {
  file: FileMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreviewSheet({ file, isOpen, onClose }: FilePreviewSheetProps) {
  if (!file) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex h-full w-full flex-col overflow-y-auto ring-0 focus-visible:ring-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        <SheetHeader className="mb-4">
            <SheetTitle className="truncate pr-4 text-xl font-bold">
              Preview: {file.fileName}
            </SheetTitle>
          <SheetDescription>
            Type: {file.resourceType || 'File'} • Size: {file.contentType}
          </SheetDescription>
        </SheetHeader>

        {/* Document Viewer Area */}
        <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-md border bg-slate-100">
          {file.url ? (() => {
            const isOfficeOrPdf = (name: string) => {
              const ext = name.split('.').pop()?.toLowerCase();
              return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(ext || '');
            };

            const previewUrl = isOfficeOrPdf(file.fileName)
              ? `https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`
              : file.url;

            return (
              <iframe
                src={previewUrl}
                className="absolute inset-0 h-full w-full"
                title={`Preview of ${file.fileName}`}
              />
            );
          })() : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              Preview not available (No URL).
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
