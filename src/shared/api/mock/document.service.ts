import { faker } from '@faker-js/faker';

import type { Document } from '@/entities/document/model/schema';

// Helper to convert string ID to a numeric seed
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Hardcoded realistic book covers
const REALISTIC_BOOK_COVERS = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', // Milk and Honey
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800', // Book with glasses
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800', // Stack of books
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800', // Law books
  'https://images.unsplash.com/photo-1555116505-a1d6ca9e1317?auto=format&fit=crop&q=80&w=800', // Tech code screen
  'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=800', // Open book
];

export interface GetDocumentsParams {
  page?: number;
  limit?: number;
  subjectId?: string;
  sort?: 'popular' | 'latest' | 'oldest';
}

export const getDocuments = async (
  params: GetDocumentsParams = {},
): Promise<{ data: Document[]; total: number }> => {
  const { page = 1, limit = 10, subjectId, sort: _sort } = params;

  // Simulate network delay (500-800ms)
  await delay(500 + Math.random() * 300);

  // Seed purely based on page/limit to keep list consistent for same params
  // Note: In a real "random" list we might not want this, but for dev stable checks it's good.
  // Or we can just let list be random-ish but items deterministic.
  // Let's seed per page to ensure navigation is consistent.
  const listSeed = stringToSeed(`list-${page}-${limit}-${subjectId || 'all'}`);
  faker.seed(listSeed);

  const total = 100; // Mock total
  const data: Document[] = Array.from({ length: limit }).map(() => {
    // Generate a random ID first (this ID will be used to seed the individual item)
    // actually, we want the ID to be consistent for this list position?
    // Let's generate a consistent ID for this index in the list
    const id = faker.string.uuid();

    // NOW, regenerate the full item using that ID as seed to ensure
    // if we navigate to detail page (getDocumentById(id)), we get SAME data.
    return generateMockDocument(id);
  });

  return {
    data,
    total,
  };
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
  // Simulate network delay
  await delay(300 + Math.random() * 200);

  // Simulate "not found" cases for testing - return null for IDs starting with "not-found-"
  if (id.startsWith('not-found-')) {
    return null;
  }

  return generateMockDocument(id);
};

export const documentService = {
  getDocuments,
  getDocumentById,
};

function generateMockDocument(id: string): Document {
  // CRITICAL: Seed faker with the ID specific seed
  faker.seed(stringToSeed(id));

  // Determine status logic - mostly published
  const statusRaw = faker.helpers.weightedArrayElement([
    { weight: 4, value: 'PUBLISHED' },
    { weight: 1, value: 'PROCESSING' },
    { weight: 1, value: 'FAILED' },
  ]);
  // Force published for successful looking mocks mostly
  const status = statusRaw as 'PROCESSING' | 'PUBLISHED' | 'FAILED';

  const coverImage = faker.helpers.arrayElement(REALISTIC_BOOK_COVERS);

  const mockDoc: Document = {
    id: id,
    title: faker.commerce.productName() + ' - ' + faker.science.unit().name,
    description: faker.lorem.paragraphs(2),
    fileUrl: faker.internet.url(), // In real app this would be a PDF url
    thumbnailUrl: coverImage,
    pageCount: faker.number.int({ min: 5, max: 100 }),
    viewCount: faker.number.int({ min: 100, max: 50000 }),
    downloadCount: faker.number.int({ min: 10, max: 10000 }),
    uploadDate: faker.date.past().toISOString(),
    isPremium: faker.datatype.boolean(),
    status: status,
    previewImages: [
      coverImage,
      ...Array.from({ length: 3 }).map(() => faker.image.urlLoremFlickr({ category: 'abstract' })),
    ],
    author: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
    },
    subject: {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      code:
        faker.string.alpha(3).toUpperCase() + faker.number.int({ min: 100, max: 999 }).toString(),
    },
  };

  return mockDoc;
}
