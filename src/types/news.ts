export type ArticleStatus = 'published' | 'draft' | 'scheduled';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  subCategory?: string;
  city?: string;
  description: string;
  content: string;
  featuredImage: string;
  imageCaption?: string;
  author: string;
  authorId: string;
  publishedAt: string;
  scheduledFor?: string;
  status: ArticleStatus;
  isFeatured: boolean;
  isBreaking: boolean;
  isTrending: boolean;
  trendingRank?: number;
  views: number;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface NewsCategory {
  id: string;
  name: string;
  englishName: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface VideoNewsItem {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  isVertical: boolean;
  publishedAt: string;
  authorId: string;
  status: 'published' | 'draft';
  summary?: string;
}

export interface PortalSettings {
  breakingNewsTicker: string;
  breakingNewsActive: boolean;
  bannerTitle: string;
  bannerLink: string;
  bannerActive: boolean;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  whatsappChannelUrl: string;
  contactEmail: string;
  contactPhone: string;
  updatedBy: string;
}

export interface AdminCredential {
  id: string;
  adminId: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

export type BiharSubSection =
  | 'all'
  | 'बिहार की ताज़ा खबरें'
  | 'बिहार राजनीति'
  | 'बिहार शिक्षा'
  | 'बिहार रोजगार'
  | 'बिहार क्राइम'
  | 'बिहार के प्रमुख शहरों की खबरें';
