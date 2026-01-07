import { z } from "zod";

export const profileCompletionSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên quá ngắn")
    .max(50, "Họ tên quá dài")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ tên không được chứa số hoặc ký tự đặc biệt"),

  studentCode: z
    .string()
    .trim()
    .length(10, "Mã sinh viên PTIT phải có đúng 10 ký tự")
    .regex(/^[A-Z][A-Z0-9]{9}$/i, "Mã SV không hợp lệ (VD: B21DCCN001)")
    .transform((val) => val.toUpperCase()),

  classCode: z
    .string()
    .trim()
    .min(8, "Mã lớp quá ngắn")
    .max(20, "Mã lớp quá dài")
    .regex(/^[A-Z0-9-]+$/i, "Mã lớp chỉ bao gồm chữ, số và dấu gạch ngang")
    .transform((val) => val.toUpperCase()),

  phone: z
    .string()
    .regex(/^(03|05|07|08|09)([0-9]{8})$/, "SĐT không đúng định dạng Việt Nam")
    .optional()
    .or(z.literal("")),
});

export type ProfileCompletionValues = z.infer<typeof profileCompletionSchema>;
