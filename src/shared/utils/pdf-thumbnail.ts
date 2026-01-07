import * as pdfjsLib from 'pdfjs-dist';

// Configure worker. Note: In Next.js with app router, you might need to copy worker to public or use CDN.
// For simplicity we try to use the one from node_modules if possible or CDN.
// standard pattern for next.js is often creating a worker file or pointing to CDN.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const generateThumbnailFromPdf = async (file: File): Promise<Blob | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas context not available');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas,
    };

    await page.render(renderContext).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/jpeg',
        0.8,
      );
    });
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
    return null;
  }
};
