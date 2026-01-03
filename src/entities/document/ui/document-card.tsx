'use client';

import * as React from 'react';
import Image from 'next/image'; // We decided to use <img> standard but user plan said "<img> tag within AspectRatio".
// Wait, user plan said: "Use a standard <img> tag...". I will follow that strictly.
import Link from 'next/link';
import { Document } from '@entities/document/model/schema';
import { cn } from '@shared/lib/utils';
import { Eye, FileText, BadgeCheck } from 'lucide-react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Badge } from '@shared/ui/badge/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@shared/ui/avatar/avatar';
import { Card, CardContent, CardFooter } from '@shared/ui/card/card';

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const [imgSrc, setImgSrc] = React.useState(document.thumbnailUrl);
  // Simple fallback image URL
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60';

  return (
    <article className="group relative flex flex-col h-full transition-all hover:-translate-y-1 hover:shadow-lg rounded-xl overflow-hidden border bg-card text-card-foreground">
      {/* Clickable Overlay */}
      <Link
        href={`/documents/${document.id}`}
        className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
        aria-label={`View ${document.title}`}
      />

      <div className="relative w-full border-b bg-muted/20">
        <AspectRatio ratio={3 / 4} className="overflow-hidden">
          {/* Using standard img as requested for mock stability */}
          <img
            src={imgSrc}
            alt={document.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </AspectRatio>

        {document.isPremium && (
          <div className="absolute top-2 right-2 z-0">
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm">
              Premium
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Subject Badge */}
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="font-normal text-xs truncate max-w-[70%] z-20">
            {document.subject.code}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base leading-tight line-clamp-2 min-h-10" title={document.title}>
          {document.title}
        </h3>

        <div className="mt-auto pt-2 flex items-center justify-between text-muted-foreground text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{document.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs">{document.pageCount}</span>
            </div>
          </div>

          {/* Author Avatar - Z-index higher to allow click interaction independent of card */}
          <button
            type="button"
            className="z-20 relative pointer-events-auto border-none bg-transparent p-0"
            aria-label={`View author ${document.author.name}`}
            onClick={(e) => {
              e.stopPropagation();
              // Mock navigation or interaction
              console.log('Clicked author', document.author.name);
            }}
          >
            <Avatar className="w-6 h-6 border cursor-pointer hover:ring-2 hover:ring-primary">
              <AvatarImage src={document.author.avatarUrl} alt={document.author.name} />
              <AvatarFallback>{document.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </article>
  );
}
