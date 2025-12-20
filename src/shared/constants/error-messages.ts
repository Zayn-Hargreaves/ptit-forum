import { BACKEND_ERROR_CODES } from "./error-codes";

export const ERROR_MESSAGES: Record<number, string> = {
  [BACKEND_ERROR_CODES.UNAUTHORIZED]: "Bạn không có quyền truy cập",
  [BACKEND_ERROR_CODES.UNAUTHENTICATED]: "Vui lòng đăng nhập",
  [BACKEND_ERROR_CODES.TOKEN_EXPIRED]: "Phiên đăng nhập đã hết hạn",
  [BACKEND_ERROR_CODES.INVALID_TOKEN]: "Token không hợp lệ",

  [BACKEND_ERROR_CODES.ACCOUNT_NOT_VERIFIED]:
    "Tài khoản chưa được xác thực. Vui lòng kiểm tra email",

  [BACKEND_ERROR_CODES.ACCOUNT_VERIFIED]: "Tài khoản đã được xác thực",

  [BACKEND_ERROR_CODES.USER_EXISTED]: "Người dùng đã tồn tại",

  [BACKEND_ERROR_CODES.USER_NOT_FOUND]: "Không tìm thấy người dùng",

  [BACKEND_ERROR_CODES.FAILED_ATTEMPTS]: "Bạn đã đăng nhập sai quá nhiều lần",

  [BACKEND_ERROR_CODES.UNCATEGORIZED_EXCEPTION]: "Có lỗi hệ thống xảy ra",
};
