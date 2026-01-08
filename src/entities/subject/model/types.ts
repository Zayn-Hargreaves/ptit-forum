import { CohortCode } from '@shared/api/classroom.service';

// --- RESPONSE DTOs (Dữ liệu từ BE trả về) ---

// Tương ứng: SubjectResponse (Java)
export interface SubjectResponse {
  id: string; // UUID -> string
  subjectName: string;
  subjectCode: string;
  credit: number; // int -> number
  description: string | null;
  createdDate: string; // LocalDateTime -> string (ISO)
  lastModifiedDate: string | null;
}

// --- REQUEST DTOs (Dữ liệu gửi lên BE) ---

// Tương ứng: SubjectRequest (Java)
export interface CreateSubjectPayload {
  subjectName: string;
  subjectCode: string;
  credit: number;
  description?: string;
}

// Tương ứng: SubjectRequest (Java) - dùng chung cấu trúc cho Update
export interface UpdateSubjectPayload extends CreateSubjectPayload {}

// --- SEARCH PARAMS ---

// Tương ứng: Tham số trong AdminSubjectController.search(...)
export interface SubjectSearchParams {
  page?: number;
  size?: number;
  // sort?: string; // Mặc định là createdDate, desc bên BE
  facultyId?: string; // UUID
  semesterId?: number;
  cohortCode?: CohortCode;
  subjectName?: string;
}
