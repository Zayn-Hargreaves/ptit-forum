import { pdfjs } from 'react-pdf';

export const setupPdfWorker = () => {
    // Use unpkg to avoid webpack compilation issues with the worker
    // Ensure the version matches the installed react-pdf version's pdfjs dependency
    // For react-pdf v9/v10, we often use pdfjs-dist
    const pdfjsVersion = pdfjs.version;

    if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
    }
};
