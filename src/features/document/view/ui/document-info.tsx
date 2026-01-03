import { Document } from '@entities/document/model/schema';
import { Button } from '@shared/ui/button/button';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Badge } from '@shared/ui/badge/badge';
import { Download, Share2, Flag } from 'lucide-react';

interface DocumentInfoProps {
  document: Document;
}

export function DocumentInfo({ document }: DocumentInfoProps) {
  return (
    <div className="flex flex-col gap-6 sticky top-4">
      {/* Title & Stats */}
      <div className="space-y-4">
        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
          {document.subject.name}
        </Badge>
        <h1 className="text-2xl font-bold leading-tight text-foreground">{document.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
          <span title="Pages">{document.pageCount} Pages</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
          <span title="Views">{document.viewCount.toLocaleString()} Views</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
          <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full gap-2 font-semibold">
          <Download className="w-5 h-5" />
          Download Document
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Flag className="w-4 h-4" /> Report
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 bg-muted/30 rounded-lg space-y-2">
        <h3 className="font-medium text-sm">Description</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{document.description}</p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
        <Avatar className="w-10 h-10 border">
          <AvatarImage src={document.author.avatarUrl} />
          <AvatarFallback>{document.author.name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{document.author.name}</span>
          <span className="text-xs text-muted-foreground">Uploader</span>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto text-primary font-medium">
          View Profile
        </Button>
      </div>
    </div>
  );
}
