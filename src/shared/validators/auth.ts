import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email không được để trống")
  .email("Email không hợp lệ")
  .trim();

export const passwordSchema = z
  .string()
  .min(1, "Mật khẩu không được để trống")
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
  .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
  .regex(/\d/, "Mật khẩu phải có ít nhất 1 chữ số")
  .regex(/[@$!%*?&]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt");

export const nameSchema = z
  .string()
  .min(1, "Tên không được để trống")
  .max(50, "Tên quá dài")
  .trim();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

const userAuthResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  enabled: z.boolean().optional(),
  roles: z
    .array(
      z.object({
        name: z.string(),
        permissions: z.array(z.any()),
      })
    )
    .optional(),
});

export const BackendResponseSchema = z.object({
  result: z.object({
    tokenResponse: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    }),
    userResponse: userAuthResponseSchema,
    permissionResponse: z.array(z.string()).optional().default([]),
  }),
});
export const profileSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn").trim(),

  phone: z
    .string()
    .regex(
      /^(03|05|07|08|09)\d{8}$/,
      "SĐT không hợp lệ (Phải là 10 số đúng đầu số VN)"
    )
    .optional()
    .or(z.literal("")),

  studentCode: z
    .string()
    .regex(/^[A-Z0-9]{10}$/i, "Mã SV phải là 10 ký tự chữ/số")
    .optional()
    .or(z.literal("")),

  classCode: z
    .string()
    .min(5, "Mã lớp quá ngắn")
    .regex(/^[A-Z0-9-]+$/i, "Mã lớp không được chứa ký tự đặc biệt")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type BackendResponse = z.infer<typeof BackendResponseSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
