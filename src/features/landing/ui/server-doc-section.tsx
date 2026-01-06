import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { DocumentCard } from '@/entities/document/ui/document-card';
import { getDocuments } from '@/shared/api/document.service';
import { Button } from '@/shared/ui';

interface ServerDocumentSectionProps {
  title: string;
  sort?: string;
  limit?: number;
}

export async function ServerDocumentSection({
  title,
  sort = 'viewCount,desc',
  limit = 6,
}: ServerDocumentSectionProps) {
  let documents = [];
  try {
    const { data } = await getDocuments({
      page: 1,
      limit,
      sort,
    });
    documents = data;
  } catch (error) {
    console.error(`Failed to fetch documents for section ${title}`, error);
    return null;
  }

  if (documents.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <Button variant="ghost" asChild>
            <Link href="/documents" className="group">
              View All{' '}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </div>
    </section>
  );
}
