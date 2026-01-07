import { CohortCode } from '@shared/api/classroom.service';

// --- RESPONSE DTOs ---
export interface SubjectReferenceResponse {
  subjectReferenceId: string;
  subjectId: string;
  subjectName: string; // <--- Thêm mới
  facultyId: string;
  facultyName: string;
  semesterId: number;
  cohortCode: string; // Backend trả về string của Enum
}

// --- REQUEST DTOs ---
export interface CreateSubjectReferencePayload {
  subjectId: string;
  facultyId: string;
  semesterId: number;
  cohortCode: CohortCode;
}

// --- SEARCH PARAMS ---
export interface SubjectReferenceSearchParams {
  page?: number;
  size?: number;
  facultyId?: string;
  semesterId?: number;
  cohortCode?: CohortCode;
  subjectId?: string;
}
