import { Suspense } from 'react';

import { UploadDocumentForm } from '@/features/document/upload/ui/upload-document-form';

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Suspense fallback={<div>Đang tải biểu mẫu...</div>}>
        <UploadDocumentForm />
      </Suspense>
    </div>
  );
}
