import { DocumentGrid } from '@features/document/list/ui/document-grid';

export default function DocumentsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Browse thousands of study resources shared by students.</p>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <aside className="hidden md:block">
            {/* Placeholder Sidebar */}
            <div className="p-4 border rounded-lg bg-card text-card-foreground">
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="p-2 hover:bg-muted rounded cursor-pointer">All Subjects</div>
                <div className="p-2 hover:bg-muted rounded cursor-pointer">Mathematics</div>
                <div className="p-2 hover:bg-muted rounded cursor-pointer">Computer Science</div>
                <div className="p-2 hover:bg-muted rounded cursor-pointer">Economics</div>
              </div>
            </div>
          </aside>
          <main>
            <DocumentGrid />
          </main>
        </div>
      </div>
    </div>
  );
}
