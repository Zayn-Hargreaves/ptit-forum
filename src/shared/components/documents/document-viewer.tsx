import { Card, CardContent } from "@shared/ui/card/card";

export function DocumentViewer({ documentId }: { documentId: string }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex aspect-3/4 items-center justify-center bg-muted">
          <div className="text-center">
            <p className="mb-2 text-lg font-semibold">Xem trước tài liệu</p>
            <p className="text-sm text-muted-foreground">
              PDF Viewer sẽ được hiển thị ở đây
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
