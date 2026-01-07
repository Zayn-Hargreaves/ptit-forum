import { Card, CardContent } from '@shared/ui/card/card';

export function DocumentViewer({ documentId: _documentId }: { documentId: string }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="bg-muted flex aspect-3/4 items-center justify-center">
          <div className="text-center">
            <p className="mb-2 text-lg font-semibold">Xem trước tài liệu</p>
            <p className="text-muted-foreground text-sm">PDF Viewer sẽ được hiển thị ở đây</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
