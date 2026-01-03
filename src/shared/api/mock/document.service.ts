import { faker } from '@faker-js/faker';
import { Document } from '@entities/document/model/schema';
import { User } from '@entities/user/schema';
import { Subject } from '@entities/subject/model/schema';
import { DocumentListParams } from '@features/document/list/model/types';

const REALISTIC_TITLES = [
  'Giải tích 1 - Đề thi giữa kỳ 2023',
  'Đại số tuyến tính - Bài tập lớn',
  'Triết học Mác - Lênin: Câu hỏi ôn tập',
  'Cấu trúc dữ liệu và giải thuật - Slide bài giảng',
  'Lập trình hướng đối tượng với Java',
  'Mạng máy tính - Đề cương môn học',
  'Hệ điều hành - Lab 1: Quản lý tiến trình',
  'Kinh tế vĩ mô - Tóm tắt lý thuyết',
  'Marketing căn bản - Case study Vinamilk',
  'Pháp luật đại cương - Bộ câu hỏi trắc nghiệm',
  'Tiếng Anh chuyên ngành CNTT - Từ vựng',
  'Vật lý đại cương 1 - Bài giải chi tiết',
  'Tư tưởng Hồ Chí Minh - Tiểu luận cuối kỳ',
  'Cơ sở dữ liệu - Thiết kế ERD quản lý thư viện',
];

const DOCUMENT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60',
];

const SUBJECTS: Subject[] = [
  { id: 'sub_1', name: 'Giải tích 1', code: 'MAT101' },
  { id: 'sub_2', name: 'Triết học Mác - Lênin', code: 'PHI101' },
  { id: 'sub_3', name: 'Lập trình C++', code: 'IT001' },
  { id: 'sub_4', name: 'Kinh tế vi mô', code: 'ECO101' },
  { id: 'sub_5', name: 'Đại số tuyến tính', code: 'MAT102' },
];

const USERS: User[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `user_${i}`,
  name: `User ${i + 1}`,
  avatarUrl: `https://avatar.vercel.sh/user_${i}`,
}));

// Helper to create a numeric seed from a string ID
function numericHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

import { Faker } from '@faker-js/faker';

function generateMockDocument(id: string): Document {
  // Create isolated faker instance with deterministic seed
  const localFaker = new Faker({ locale: faker.locale });
  localFaker.seed(numericHash(id));

  const randomTitle = localFaker.helpers.arrayElement(REALISTIC_TITLES);
  const randomSubject = localFaker.helpers.arrayElement(SUBJECTS);
  const randomUser = localFaker.helpers.arrayElement(USERS);
  const randomThumb = localFaker.helpers.arrayElement(DOCUMENT_THUMBNAILS);

  return {
    id,
    title: randomTitle,
    description: localFaker.lorem.paragraph(),
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: randomThumb,
    pageCount: localFaker.number.int({ min: 1, max: 100 }),
    viewCount: localFaker.number.int({ min: 100, max: 50000 }),
    downloadCount: localFaker.number.int({ min: 10, max: 5000 }),
    uploadDate: localFaker.date.past(),
    author: randomUser,
    subject: randomSubject,
    isPremium: localFaker.datatype.boolean({ probability: 0.3 }),
    status: 'published',
  };
}

export async function getDocuments(
  params: DocumentListParams = {}
): Promise<{ data: Document[]; total: number; totalPages: number }> {
  const { page = 1, limit = 10 } = params;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const total = 50;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  // Generate IDs deterministically for the list based on index
  const ids = Array.from({ length: Math.min(limit, total - startIndex) }).map((_, i) => `doc_${startIndex + i}`);

  const data = ids.map((id) => generateMockDocument(id));

  return { data, total, totalPages };
}

export async function getDocumentById(id: string): Promise<Document> {
  // Simulate network
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateMockDocument(id);
}
