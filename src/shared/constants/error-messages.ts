import { BACKEND_ERROR_CODES } from "./error-codes";

export const ERROR_MESSAGES: Record<number, string> = {
  // Authentication & Authorization
  [BACKEND_ERROR_CODES.UNAUTHORIZED]: "Bạn không có quyền truy cập",
  [BACKEND_ERROR_CODES.UNAUTHENTICATED]: "Vui lòng đăng nhập",
  [BACKEND_ERROR_CODES.TOKEN_EXPIRED]: "Phiên đăng nhập đã hết hạn",
  [BACKEND_ERROR_CODES.INVALID_TOKEN]: "Token không hợp lệ",
  [BACKEND_ERROR_CODES.FORBIDDEN]: "Bạn không được phép thực hiện hành động này",

  // Account
  [BACKEND_ERROR_CODES.ACCOUNT_NOT_VERIFIED]:
    "Tài khoản chưa được xác thực. Vui lòng kiểm tra email",
  [BACKEND_ERROR_CODES.ACCOUNT_VERIFIED]: "Tài khoản đã được xác thực",
  [BACKEND_ERROR_CODES.ACCOUNT_ALREADY_VERIFIED]: "Tài khoản đã được xác thực trước đó",

  // User
  [BACKEND_ERROR_CODES.USER_EXISTED]: "Người dùng đã tồn tại",
  [BACKEND_ERROR_CODES.USER_NOT_FOUND]: "Không tìm thấy người dùng",
  [BACKEND_ERROR_CODES.INVALID_PASSWORD]: "Mật khẩu không chính xác",
  [BACKEND_ERROR_CODES.INVALID_STUDENT_CODE]: "Mã sinh viên không hợp lệ",

  // Faculty & Class
  [BACKEND_ERROR_CODES.FACULTY_NOT_FOUND]: "Không tìm thấy khoa",
  [BACKEND_ERROR_CODES.CLASS_CODE_EXISTED]: "Mã lớp đã tồn tại",
  [BACKEND_ERROR_CODES.CLASS_CODE_INVALID]: "Mã lớp không hợp lệ",
  [BACKEND_ERROR_CODES.FACULTY_CODE_MISMATCH]: "Mã khoa không khớp",
  [BACKEND_ERROR_CODES.STUDENT_CODE_NULL]: "Mã sinh viên không được để trống",

  // Subject & Semester
  [BACKEND_ERROR_CODES.SUBJECT_NOT_FOUND]: "Không tìm thấy môn học",
  [BACKEND_ERROR_CODES.SUBJECT_REFERENCE_NOT_FOUND]: "Không tìm thấy tham chiếu môn học",
  [BACKEND_ERROR_CODES.SEMESTER_NOT_FOUND]: "Không tìm thấy học kỳ",

  // GPA & CPA
  [BACKEND_ERROR_CODES.CPA_PROFILE_NOT_FOUND]: "Không tìm thấy hồ sơ điểm tích lũy",
  [BACKEND_ERROR_CODES.GPA_PROFILE_NOT_FOUND]: "Không tìm thấy hồ sơ điểm trung bình",

  // Forum - Category, Topic, Post, Comment
  [BACKEND_ERROR_CODES.CATEGORY_NOT_FOUND]: "Không tìm thấy danh mục",
  [BACKEND_ERROR_CODES.INVALID_CATEGORY_TYPE]: "Loại danh mục không hợp lệ",
  [BACKEND_ERROR_CODES.TOPIC_NOT_FOUND]: "Không tìm thấy chủ đề",
  [BACKEND_ERROR_CODES.POST_NOT_FOUND]: "Không tìm thấy bài viết",
  [BACKEND_ERROR_CODES.COMMENT_NOT_FOUND]: "Không tìm thấy bình luận",
  [BACKEND_ERROR_CODES.INVALID_PARENT_COMMENT]: "Bình luận cha không hợp lệ",

  // Topic Members
  [BACKEND_ERROR_CODES.TOPIC_MEMBER_NOT_FOUND]: "Không tìm thấy thành viên chủ đề",
  [BACKEND_ERROR_CODES.TOPIC_MEMBER_EXISTED]: "Thành viên đã tồn tại trong chủ đề",

  // Reports
  [BACKEND_ERROR_CODES.INVALID_REPORT_TARGET]: "Đối tượng báo cáo không hợp lệ",
  [BACKEND_ERROR_CODES.REPORT_ALREADY_EXISTED]: "Báo cáo đã tồn tại",
  [BACKEND_ERROR_CODES.REPORT_NOT_FOUND]: "Không tìm thấy báo cáo",

  // Files
  [BACKEND_ERROR_CODES.FILE_NOT_FOUND]: "Không tìm thấy tệp",
  [BACKEND_ERROR_CODES.FILE_UPLOAD_FAILED]: "Tải tệp lên thất bại",
  [BACKEND_ERROR_CODES.PAYLOAD_TOO_LARGE]: "Kích thước tệp quá lớn",

  // Announcements
  [BACKEND_ERROR_CODES.ANNOUNCEMENT_NOT_FOUND]: "Không tìm thấy thông báo",

  // Activity Logs
  [BACKEND_ERROR_CODES.ACTIVITY_LOG_NOT_FOUND]: "Không tìm thấy nhật ký hoạt động",

  // Password Reset
  [BACKEND_ERROR_CODES.SESSION_RESET_PASSWORD_NOT_FOUND]:
    "Không tìm thấy phiên đặt lại mật khẩu",
  [BACKEND_ERROR_CODES.SESSION_RESET_PASSWORD_HAS_USED]:
    "Phiên đặt lại mật khẩu đã được sử dụng",
  [BACKEND_ERROR_CODES.FAILED_ATTEMPTS]: "Bạn đã đăng nhập sai quá nhiều lần",

  // Email
  [BACKEND_ERROR_CODES.EMAIL_NOT_FOUND]: "Không tìm thấy email",
  [BACKEND_ERROR_CODES.CAN_NOT_SEND_EMAIL]: "Không thể gửi email",

  // Status Transitions
  [BACKEND_ERROR_CODES.INVALID_POST_STATUS_TRANSITION]:
    "Chuyển đổi trạng thái bài viết không hợp lệ",
  [BACKEND_ERROR_CODES.INVALID_STATUS_TRANSITION]: "Chuyển đổi trạng thái không hợp lệ",

  // General Errors
  [BACKEND_ERROR_CODES.VALIDATION_ERROR]: "Dữ liệu không hợp lệ",
  [BACKEND_ERROR_CODES.BAD_REQUEST]: "Yêu cầu không hợp lệ",
  [BACKEND_ERROR_CODES.CONFLICT]: "Xung đột dữ liệu",
  [BACKEND_ERROR_CODES.INVALID_REQUEST]: "Yêu cầu không hợp lệ",
  [BACKEND_ERROR_CODES.UUID_IS_INVALID]: "UUID không hợp lệ",
  [BACKEND_ERROR_CODES.UNSUPPORTED_TARGET_TYPE]: "Loại đối tượng không được hỗ trợ",
  [BACKEND_ERROR_CODES.UNCATEGORIZED_EXCEPTION]: "Có lỗi hệ thống xảy ra",
};

