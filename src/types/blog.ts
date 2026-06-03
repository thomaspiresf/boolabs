export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string; // ISO String (or YYYY-MM-DD)
  readingTime: string; // e.g., '5 min'
  featured: boolean;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}
