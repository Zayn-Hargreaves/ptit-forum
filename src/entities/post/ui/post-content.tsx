'use client';

import React, { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { cn } from '@shared/lib/utils';

interface PostContentProps {
  content: string;
  className?: string;
}

export function PostContent({ content, className }: Readonly<PostContentProps>) {
  const cleanContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|(?:\/|\.\/|\.\.\/))/i,
      RETURN_TRUSTED_TYPE: true,
      ALLOW_DATA_ATTR: false,
      FORCE_BODY: true,
      ADD_TAGS: [
        'iframe',
        'video',
        'source',
        'img',
        'table',
        'tbody',
        'thead',
        'tfoot',
        'tr',
        'td',
        'th',
        'caption',
        'col',
        'colgroup',
        'pre',
        'code',
      ],
      ADD_ATTR: [
        'allow',
        'allowfullscreen',
        'frameborder',
        'scrolling',
        'src',
        'controls',
        'autoplay',
        'loop',
        'muted',
        'poster',
        'class',
        'style',
        'width',
        'height',
        'target',
        'rel',
      ],
    });
  }, [content]);

  return (
    <div
      className={cn(
        'prose prose-stone max-w-none dark:prose-invert',

        className
      )}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
}
