import type { TrendingPost } from "../model/types";
import type { BackendPostDTO } from "../api/post.dto";

export function mapTrendingPost(dto: BackendPostDTO): TrendingPost {
  const id = dto.id;

  if (!id) {
    return {
      id: `missing-id-${crypto.randomUUID()}`,
      title: "Error: Invalid Post Data",
      author: { name: "System" },
      category: "Error",
      comments: 0,
      views: 0,
    };
  }

  const authorName =
    dto.authorName?.trim() || dto.createdBy?.name?.trim() || "Ẩn danh";

  const authorId = dto.createdBy?.id ? String(dto.createdBy.id) : undefined;

  return {
    id: String(id),
    title: dto.title?.trim() || "Tiêu đề không khả dụng",
    author: {
      id: authorId,
      name: authorName,
      avatar: dto.createdBy?.avatarUrl,
    },
    category: dto.categoryName?.trim() || "Chung",
    comments: parseInt(String(dto.commentCount ?? 0), 10) || 0,
    views: parseInt(String(dto.viewCount ?? 0), 10) || 0,
  };
}
