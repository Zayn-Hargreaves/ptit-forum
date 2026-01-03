import { faker } from '@faker-js/faker';
import { Document } from '@entities/document/model/schema';
import { User } from '@entities/user/schema';
import { Subject } from '@entities/subject/model/schema';

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

// Placeholder images representing documents/papers/books
const DOCUMENT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&auto=format&fit=crop&q=60', // Paper/Study
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60', // Book stack
  'https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=60', // Notes
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60', // Papers text
];

const SUBJECTS: Subject[] = [
  { id: 'sub_1', name: 'Giải tích 1', code: 'MAT101' },
  { id: 'sub_2', name: 'Triết học Mác - Lênin', code: 'PHI101' },
  { id: 'sub_3', name: 'Lập trình C++', code: 'IT001' },
  { id: 'sub_4', name: 'Kinh tế vi mô', code: 'ECO101' },
  { id: 'sub_5', name: 'Đại số tuyến tính', code: 'MAT102' },
];

const USERS: User[] = Array.from({ length: 5 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  avatarUrl: faker.image.avatar(),
}));

import { DocumentListParams } from "@features/document/list/model/types";

export async function getMockDocuments(
  params: DocumentListParams = {}
): Promise<{ data: Document[]; total: number; totalPages: number }> {
  const { page = 1, limit = 10 } = params;
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const total = 50; // Total mock items
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const data: Document[] = Array.from({ length: Math.min(limit, total - startIndex) }).map((_, index) => {
    // Deterministic pseudo-random based on page/index to keep list stable across re-renders if needed
    // But for simple mock, pure random is fine.
    const globalIndex = startIndex + index;

    // Seed faker for deterministic results per document index
    faker.seed(globalIndex);

    const randomTitle = faker.helpers.arrayElement(REALISTIC_TITLES);
    const randomSubject = faker.helpers.arrayElement(SUBJECTS);
    const randomUser = faker.helpers.arrayElement(USERS);
    const randomThumb = faker.helpers.arrayElement(DOCUMENT_THUMBNAILS);

    // If title doesn't match subject, maybe adjust?
    // To be super realistic, we might map titles to subjects, but random mix is okay for Phase 1.

    return {
      id: faker.string.uuid(),
      title: randomTitle,
      description: faker.lorem.paragraph(),
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Valid PDF sample
      thumbnailUrl: randomThumb,
      pageCount: faker.number.int({ min: 1, max: 100 }),
      viewCount: faker.number.int({ min: 100, max: 50000 }),
      downloadCount: faker.number.int({ min: 10, max: 5000 }),
      uploadDate: faker.date.past(),
      author: randomUser,
      subject: randomSubject,
      isPremium: faker.datatype.boolean({ probability: 0.3 }), // 30% premium
      status: 'published', // Mostly published
    };
  });

  return {
    data,
    total,
    totalPages,
  };
}
