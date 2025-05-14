
export type Category =
  | 'politics'
  | 'technology'
  | 'business'
  | 'health'
  | 'science'
  | 'entertainment'
  | 'sports'
  | 'world'
  | 'journal';

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  author: string;
  publishedAt: string;
  summary: string;
  content: string;
  imageUrl: string;
  url: string;
  categories: Category[];
  trending: boolean;
  apiSource?: string; // The API source that provided this article
}
