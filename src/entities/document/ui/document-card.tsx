'use client';

import { Eye, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Document } from '@/entities/document/model/schema';
import { AspectRatio } from '@/shared/ui/aspect-ratio/aspect-ratio';

interface DocumentCardProps {
  document: Document;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const [imgSrc, setImgSrc] = useState(document.thumbnailUrl);

  return (
    <article className="group relative flex flex-col space-y-3 rounded-lg border p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Click Overlay */}
      <Link href={`/documents/${document.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {document.title}</span>
      </Link>

      {/* Thumbnail Section */}
      <div className="relative overflow-hidden rounded-md">
        <AspectRatio ratio={3 / 4}>
          <Image
            src={imgSrc}
            alt={document.title}
            width={300}
            height={400}
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
          <div className="absolute top-2 right-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white shadow-md">
            PRO
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col space-y-1">
        <h3
          className="line-clamp-2 min-h-[2.5rem] leading-tight font-semibold"
          title={document.title}
        >
          {document.title}
        </h3>

        {/* Meta Row */}
        <div className="text-muted-foreground flex items-center space-x-3 text-xs">
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
        <div className="text-muted-foreground mt-2 flex items-center gap-2 border-t pt-2 text-xs">
          {/* Using a small fallback approach for avatar if needed, but assuming valid currently */}
          <Image
            src={document.author.avatar}
            alt={document.author.name}
            width={20}
            height={20}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="truncate">{document.author.name}</span>
        </div>
      </div>
    </article>
  );
};
