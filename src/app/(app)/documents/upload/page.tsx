import { Suspense } from 'react';
import { UploadDocumentForm } from '@/features/document/upload/ui/upload-document-form';

export default function UploadPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <Suspense fallback={<div>Loading form...</div>}>
                <UploadDocumentForm />
            </Suspense>
        </div>
    );
}
