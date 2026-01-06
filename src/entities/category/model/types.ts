
export enum CategoryType {
    CLUB = "CLUB",
    CLASSROOM = "CLASSROOM",
    LIFE = "LIFE",
    ACADEMIC = "ACADEMIC",
}

// --- RESPONSE DTOs (Dữ liệu nhận từ BE) ---

// Tương ứng: CategoryResponse
export interface CategoryResponse {
    id: string;             // UUID -> string
    name: string;
    description: string;
    categoryType: CategoryType;
    createdAt: string;      // LocalDateTime -> string (ISO)
    createdById: string;    // UUID -> string
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

// --- SEARCH/FILTER (Optional) ---
// Controller hiện tại chỉ có getAll() không tham số,
// nhưng nếu sau này bạn thêm filter thì cấu trúc sẽ như sau:
/*
export interface CategorySearchParams {
    keyword?: string;
    type?: CategoryType;
}
*/