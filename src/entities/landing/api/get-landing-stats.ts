export type LandingStat = { label: string; value: string };

export async function getLandingStats(): Promise<LandingStat[]> {
  // TODO: sau này nối DB/Redis
  // tạm thời return mock nhưng ở đúng layer + dễ thay thế
  return [
    { label: "Sinh viên", value: "5,000+" },
    { label: "Bài viết", value: "1,200+" },
    { label: "Tài liệu", value: "800+" },
  ];
}
