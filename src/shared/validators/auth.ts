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
  .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
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

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
