// entities/semester/model/types.ts

// Tương ứng: SemesterResponse
export interface SemesterResponse {
  id: number; // Backend trả về Integer
  semesterType: string; // "1", "2", "3" hoặc "SPRING", "SUMMER"...
  schoolYear: number; // VD: 2023, 2024
}

// Tương ứng: SemesterRequest
export interface CreateSemesterPayload {
  id: number; // Backend yêu cầu nhập ID thủ công
  semesterType: string;
  schoolYear: number;
}
