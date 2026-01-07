export const stripHtml = (html: string) => {
  if (!html) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  } catch (_e) {
    // Fallback for SSR or if DOMParser is missing
    return html.replace(/<[^>]*>?/gm, '');
  }
};
