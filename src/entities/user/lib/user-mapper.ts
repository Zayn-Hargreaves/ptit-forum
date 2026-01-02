import { UserProfile, UserProfileResponseDto } from '@entities/session/model/types';

export const mapToUser = (dto: UserProfileResponseDto): UserProfile => {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.fullName,
    avatarUrl: dto.avatarUrl,
    studentCode: dto.studentCode,
    classCode: dto.classCode,
    phone: dto.phone,
    facultyName: dto.facultyName,
  };
};
