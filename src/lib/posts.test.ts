import { describe, expect, it } from 'vitest';
import {
  getAllTags,
  getFeaturedPosts,
  getPublishedPosts,
  getTagSlug,
  sortPostsByDate,
  type BlogPostLike
} from './posts';

const posts: BlogPostLike[] = [
  {
    id: 'older-post',
    slug: 'older-post',
    data: {
      title: '旧文章',
      description: '旧文章摘要',
      pubDate: new Date('2026-01-01'),
      category: '技术',
      tags: ['Astro', '写作'],
      draft: false,
      featured: false
    }
  },
  {
    id: 'featured-post',
    slug: 'featured-post',
    data: {
      title: '精选文章',
      description: '精选文章摘要',
      pubDate: new Date('2026-06-01'),
      category: '项目',
      tags: ['项目', 'Astro'],
      draft: false,
      featured: true
    }
  },
  {
    id: 'draft-post',
    slug: 'draft-post',
    data: {
      title: '草稿',
      description: '草稿摘要',
      pubDate: new Date('2026-07-01'),
      category: '随笔',
      tags: ['草稿'],
      draft: true,
      featured: true
    }
  }
];

describe('post helpers', () => {
  it('只返回非草稿文章，并按发布时间倒序排列', () => {
    expect(getPublishedPosts(posts).map((post) => post.slug)).toEqual([
      'featured-post',
      'older-post'
    ]);
  });

  it('只从已发布文章中返回精选文章', () => {
    expect(getFeaturedPosts(posts).map((post) => post.slug)).toEqual([
      'featured-post'
    ]);
  });

  it('从已发布文章中提取去重标签', () => {
    expect(getAllTags(posts)).toEqual(['Astro', '写作', '项目']);
  });

  it('将标签转换为稳定路由 slug', () => {
    expect(getTagSlug('Astro 基础')).toBe('astro-基础');
  });

  it('不会修改原始文章数组', () => {
    const sorted = sortPostsByDate(posts);
    expect(sorted).not.toBe(posts);
    expect(posts[0].slug).toBe('older-post');
  });
});
