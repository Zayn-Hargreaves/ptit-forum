import { FileAttachment } from "../model/types";
import { FileIcon, ExternalLinkIcon } from "lucide-react";
import Link from 'next/link';

interface AttachmentItemProps {
    attachment: FileAttachment;
}

export function AttachmentItem({ attachment }: AttachmentItemProps) {
    return (
        <Link
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 group min-h-[44px]"
        >
            {/* Icon Wrapper */}
            <div className="flex-shrink-0 p-2 mr-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FileIcon className="w-5 h-5 text-blue-600" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.fileName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    {formatFileSize(attachment.size)}
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="uppercase">{attachment.fileType.split('/').pop()}</span>
                </p>
            </div>

            {/* Action Icon */}
            <div className="flex-shrink-0 ml-3 text-gray-400 group-hover:text-blue-500">
                <ExternalLinkIcon className="w-4 h-4" />
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
