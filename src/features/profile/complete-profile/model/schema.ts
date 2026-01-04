import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Tên quá ngắn").max(50),
  studentId: z
    .string()
    .regex(
      /^B\d{2}[A-Z]{4}\d{3}$/,
      "Mã SV không đúng định dạng (VD: B21DCCN001)"
    ),
  faculty: z.string().min(1, "Vui lòng nhập khoa"),
  class: z.string().min(1, "Vui lòng nhập lớp"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
