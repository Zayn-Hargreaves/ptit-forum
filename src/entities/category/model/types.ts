export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export enum CategoryType {
  CLUB = 'CLUB',
  CLASSROOM = 'CLASSROOM',
  LIFE = 'LIFE',
  ACADEMIC = 'ACADEMIC',
}

// --- RESPONSE DTOs (Dữ liệu nhận từ BE) ---

// Tương ứng: CategoryResponse
export interface CategoryResponse {
  id: string; // UUID -> string
  name: string;
  description: string;
  categoryType: CategoryType;
  createdAt: string; // LocalDateTime -> string (ISO)
  createdById: string; // UUID -> string
}

// --- REQUEST DTOs (Dữ liệu gửi lên BE) ---

// Tương ứng: CategoryRequest (Dùng cho hàm create)
export interface CreateCategoryPayload {
  name: string;
  description: string;
  categoryType: CategoryType;
}

// Tương ứng: CategoryRequest (Dùng cho hàm update)
// Mặc dù field giống Create, nhưng tách ra để dễ mở rộng sau này (giống style Announcement)
export interface UpdateCategoryPayload {
  name: string;
  description: string;
  categoryType: CategoryType;
}
