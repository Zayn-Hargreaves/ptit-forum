import { Metadata } from 'next';
import { DocumentListView } from './document-list-view';

export const metadata: Metadata = {
    title: 'Documents | StudocuClone',
    description: 'Browse thousands of study materials, lecture notes, and practice exams.',
};

export default function DocumentsPage() {
    return <DocumentListView />;
}
