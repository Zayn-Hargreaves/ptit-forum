import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';

import { documentService } from '@/shared/api/document.service';

import { DocumentDetailView } from './document-detail-view';

function truncate(text: string | null | undefined, maxLen: number): string {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

const getCachedDocument = cache(documentService.getDocumentById);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  // fetch data
  const document = await getCachedDocument(id);

  if (!document) {
    return {
      title: 'Document Not Found',
    };
  }

  return {
    title: `${document.title} | StudocuClone`,
    description: truncate(document.description, 160),
    openGraph: {
      title: document.title,
      description: truncate(document.description, 160),
      images: [
        {
          url: document.thumbnailUrl,
          width: 800,
          height: 600,
          alt: document.title,
        },
      ],
    },
  };
}

export default async function DocumentPage(props: Props) {
  const params = await props.params;
  const document = await getCachedDocument(params.id);

  if (!document) {
    notFound();
  }

  // Pass initial data to client component if we were doing hydration,
  // but here we are using a client component that fetches data itself (DocumentDetailView is not created yet, wait).
  // The previous implementation of page.tsx was a client component.
  // Now we are switching to server component for Metadata.
  // We should move the UI logic to a Client Component `document - detail - view.tsx`
  // OR we can pass the server-fetched initial data to React Query using `initialData`.
  // Let's create `document - detail - view.tsx` containing the UI that was in page.tsx

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-10">
          <div className="bg-muted h-8 w-1/3 animate-pulse rounded"></div>
        </div>
      }
    >
      <DocumentDetailView id={params.id} initialData={document} />
    </Suspense>
  );
}
