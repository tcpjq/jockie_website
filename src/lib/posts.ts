import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export type BlogPostLike = {
  id: string;
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    category: string;
    tags?: string[];
    draft?: boolean;
    featured?: boolean;
  };
};

export function sortPostsByDate<T extends BlogPostLike>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

export function getPublishedPosts<T extends BlogPostLike>(posts: T[]): T[] {
  return sortPostsByDate(posts.filter((post) => !post.data.draft));
}

export function getFeaturedPosts<T extends BlogPostLike>(posts: T[]): T[] {
  return getPublishedPosts(posts).filter((post) => post.data.featured);
}

export function getAllTags<T extends BlogPostLike>(posts: T[]): string[] {
  const tags = posts
    .filter((post) => !post.data.draft)
    .flatMap((post) => post.data.tags ?? []);
  return Array.from(new Set(tags));
}

export function getTagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
