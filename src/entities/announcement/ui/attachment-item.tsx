import { ExternalLinkIcon, FileIcon } from 'lucide-react';
import Link from 'next/link';

import { FileAttachment } from '../model/types';

interface AttachmentItemProps {
  attachment: FileAttachment;
}

export function AttachmentItem({ attachment }: AttachmentItemProps) {
  return (
    <Link
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-2 flex min-h-[44px] min-w-0 items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
    >
      {/* Icon Wrapper */}
      <div className="mr-3 flex-shrink-0 rounded-lg bg-blue-50 p-2 transition-colors group-hover:bg-blue-100">
        <FileIcon className="h-5 w-5 text-blue-600" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{attachment.fileName}</p>
        <p className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-gray-500">
          <span className="shrink-0">{formatFileSize(attachment.size)}</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300" />
          <span className="min-w-0 flex-1 truncate uppercase">
            {attachment.fileType.split('/').pop()}
          </span>
        </p>
      </div>

      {/* Action Icon */}
      <div className="ml-3 flex-shrink-0 text-gray-400 group-hover:text-blue-500">
        <ExternalLinkIcon className="h-4 w-4" />
      </div>
    </Link>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
