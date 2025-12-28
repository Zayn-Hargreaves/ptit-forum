import { User, UserProfileResponseDto } from "@entities/session/model/types";

export const mapToUser = (dto: UserProfileResponseDto): User => {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.fullName,
    avatar: dto.avatarUrl,
    studentCode: dto.studentCode,
    classCode: dto.classCode,
    phone: dto.phone,
    facultyName: dto.facultyName,
  };
};
