import { useState } from 'react';
import Link from 'next/link';
import { Eye, FileText } from 'lucide-react';
import { Document } from '@/entities/document/model/schema';
import { AspectRatio } from '@/shared/ui/aspect-ratio/aspect-ratio';
import { cn } from '@/shared/lib/utils';

interface DocumentCardProps {
  document: Document;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const [imgSrc, setImgSrc] = useState(document.thumbnailUrl);

  return (
    <article className="group relative flex flex-col space-y-3 rounded-lg border p-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Click Overlay */}
      <Link href={`/documents/${document.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {document.title}</span>
      </Link>

      {/* Thumbnail Section */}
      <div className="relative overflow-hidden rounded-md">
        <AspectRatio ratio={3 / 4}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={document.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              if (imgSrc !== 'https://placehold.co/300x400?text=No+Preview') {
                setImgSrc('https://placehold.co/300x400?text=No+Preview');
              }
            }}
          />
        </AspectRatio>

        {/* Badges/Overlays */}
        {document.isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            PRO
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold leading-tight line-clamp-2 min-h-[2.5rem]" title={document.title}>
          {document.title}
        </h3>

        {/* Meta Row */}
        <div className="flex items-center text-xs text-muted-foreground space-x-3">
          <div className="flex items-center">
            <Eye className="mr-1 h-3 w-3" />
            <span>{document.viewCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <FileText className="mr-1 h-3 w-3" />
            <span>{document.pageCount} p</span>
          </div>
        </div>

        {/* Author (Optional extra) */}
        <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground border-t mt-2">
          {/* Using a small fallback approach for avatar if needed, but assuming valid currently */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={document.author.avatar} alt={document.author.name} className="w-5 h-5 rounded-full object-cover" />
          <span className="truncate">{document.author.name}</span>
        </div>
      </div>
    </article>
  );
};
