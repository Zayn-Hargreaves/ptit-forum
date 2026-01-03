import { ResolvingMetadata, Metadata } from 'next';
import { getDocumentById } from '@shared/api/mock/document.service';
import DocumentDetailClient from './client-page';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate Dynamic Metadata
export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;

  // Fetch data (Server-side)
  // Logic must be deterministic so Title matches Client hydration
  const document = await getDocumentById(id);

  if (!document) {
    return {
      title: 'Document Not Found - StudocuClone',
      description: 'The requested document could not be found.',
    };
  }

  return {
    title: `${document.title} - StudocuClone`,
    description: document.description?.substring(0, 160) ?? '',
    openGraph: {
      title: document.title,
      description: document.description?.substring(0, 160) ?? '',
      images: [document.thumbnailUrl],
    },
  };
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <DocumentDetailClient id={id} />;
}
