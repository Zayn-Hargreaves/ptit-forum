export type TrendingPost = {
  id: string;
  title: string;
  author: {
    id?: string;
    name: string;
    avatar?: string;
  };
  category: string;
  comments: number;
  views: number;
  createdAt?: string;
};
