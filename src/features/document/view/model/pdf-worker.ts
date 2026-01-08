import { pdfjs } from 'react-pdf';

export const setupPdfWorker = () => {
  // For React-PDF v9/v10, we need to match the version exactly.
  // We use the CDN for simplicity, but in production, copying the file to public/ is better.
  if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
};
