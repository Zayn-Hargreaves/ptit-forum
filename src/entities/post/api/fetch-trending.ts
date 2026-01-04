import "server-only";
import { BackendTrendingResponseSchema } from "./post.schema";
import { mapTrendingPost } from "../lib/map-post";

export async function fetchTrendingPosts() {
  const baseUrl = process.env.INTERNAL_BACKEND_URL;

  if (!baseUrl) {
    throw new Error("Missing INTERNAL_BACKEND_URL");
  }

  const url = new URL(`${baseUrl}/posts`);
  url.searchParams.set("sort", "reactionCount,desc");
  url.searchParams.set("size", "3");

  try {
    const res = await fetch(url.toString(), {
      next: {
        revalidate: 60,
        tags: ["trending-posts"],
      },
    });

    if (!res.ok) {
      console.error(`Fetch trending failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = await res.json();

    const parsed = BackendTrendingResponseSchema.safeParse(json);

    if (!parsed.success) {
      console.error("Invalid Trending Schema:", parsed.error);
      return [];
    }

    return parsed.data.map(mapTrendingPost);
  } catch (error) {
    console.error("Network error fetching trending:", error);
    return [];
  }
}
