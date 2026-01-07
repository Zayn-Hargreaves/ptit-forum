import { Document } from '@entities/document/model/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Download, Flag, Share2 } from 'lucide-react';

interface DocumentInfoProps {
  document: Document;
}

export function DocumentInfo({ document }: DocumentInfoProps) {
  return (
    <div className="sticky top-4 flex flex-col gap-6">
      {/* Title & Stats */}
      <div className="space-y-4">
        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
          {document.subject.name}
        </Badge>
        <h1 className="text-foreground text-2xl leading-tight font-bold">{document.title}</h1>
        <div className="text-muted-foreground flex items-center gap-4 border-b pb-4 text-sm">
          <span title="Pages">{document.pageCount} Pages</span>
          <span className="bg-muted-foreground h-1 w-1 rounded-full" />
          <span title="Views">{document.viewCount.toLocaleString()} Views</span>
          <span className="bg-muted-foreground h-1 w-1 rounded-full" />
          <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full gap-2 font-semibold">
          <Download className="h-5 w-5" />
          Download Document
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button
            variant="outline"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
          >
            <Flag className="h-4 w-4" /> Report
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-muted/30 space-y-2 rounded-lg p-4">
        <h3 className="text-sm font-medium">Description</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{document.description}</p>
      </div>

      {/* Author */}
      <div className="bg-card flex items-center gap-3 rounded-lg border p-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={document.author.avatar} />
          <AvatarFallback>{document.author.name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{document.author.name}</span>
          <span className="text-muted-foreground text-xs">Uploader</span>
        </div>
        <Button variant="ghost" size="sm" className="text-primary ml-auto font-medium">
          View Profile
        </Button>
      </div>
    </div>
  );
}
