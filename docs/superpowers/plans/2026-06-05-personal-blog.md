# 个人博客 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用 Astro 搭建一个个人主页型 Markdown 博客，支持首页、文章列表、文章详情、标签、关于页、RSS 和基础 SEO。

**Architecture:** 使用 Astro 静态站点生成。文章存放在 `src/content/blog/*.md`，通过 Astro Content Collections 做 frontmatter schema 校验。页面负责路由和数据查询，`src/lib/posts.ts` 负责文章过滤、排序和标签派生，组件只负责展示。

**Tech Stack:** Astro, TypeScript, Astro Content Collections, @astrojs/rss, Vitest, Playwright, CSS.

---

## 文件结构

创建和修改这些文件：

- `package.json`：项目脚本和依赖。
- `astro.config.mjs`：Astro 配置，包含站点 URL。
- `tsconfig.json`：TypeScript 配置。
- `vitest.config.ts`：单元测试配置。
- `playwright.config.ts`：端到端检查配置。
- `src/content.config.ts`：`blog` 内容集合 schema。
- `src/content/blog/*.md`：示例文章和草稿文章。
- `src/lib/posts.ts`：文章查询、排序、标签、slug 工具函数。
- `src/lib/posts.test.ts`：文章工具函数单元测试。
- `src/styles/global.css`：全局布局、排版、响应式样式。
- `src/components/Layout.astro`：共享页面外壳、导航、页脚和 SEO metadata。
- `src/components/PostCard.astro`：文章卡片。
- `src/components/TagList.astro`：标签链接列表。
- `src/components/ProfileIntro.astro`：首页个人介绍。
- `src/components/SectionHeader.astro`：区块标题。
- `src/pages/index.astro`：首页。
- `src/pages/blog/index.astro`：文章列表页。
- `src/pages/blog/[slug].astro`：文章详情页。
- `src/pages/tags/index.astro`：标签总览页。
- `src/pages/tags/[tag].astro`：标签文章列表页。
- `src/pages/about.astro`：关于页。
- `src/pages/rss.xml.ts`：RSS 订阅。
- `tests/site.spec.ts`：Playwright 页面行为检查。
- `README.md`：更新项目说明和常用命令。

## Task 1: 初始化 Astro 项目配置

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Modify: `README.md`

- [x] **Step 1: 创建项目配置文件**

Create `package.json`:

```json
{
  "name": "jockie-website",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@astrojs/check": "latest",
    "@astrojs/rss": "latest",
    "astro": "latest",
    "typescript": "latest"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "vitest": "latest"
  }
}
```

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jockie.dev'
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://127.0.0.1:4321'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } }
  ]
});
```

Modify `README.md`:

```md
# jockie_website

个人主页型博客，基于 Astro 和 Markdown。

## 常用命令

```bash
npm install
npm run dev
npm run check
npm run test
npm run build
```

## 内容写作

文章放在 `src/content/blog/`，使用 Markdown 和 frontmatter 管理标题、摘要、日期、分类、标签、草稿和精选状态。
```

- [x] **Step 2: 安装依赖**

Run: `npm install`

Expected: 生成 `package-lock.json` 和 `node_modules/`，命令退出码为 0。

- [x] **Step 3: 验证脚手架命令可用**

Run: `npm run check`

Expected: 失败，错误中包含缺少 Astro 源目录或页面入口的提示。这个失败是预期的，因为还没有创建 `src/pages`。

- [x] **Step 4: 提交配置初始化**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts README.md
git commit -m "chore: initialize astro blog project"
```

## Task 2: 定义内容集合和文章工具函数

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/hello-astro.md`
- Create: `src/content/blog/reading-notes.md`
- Create: `src/content/blog/draft-note.md`
- Create: `src/lib/posts.ts`
- Create: `src/lib/posts.test.ts`

- [x] **Step 1: 写文章工具函数测试**

Create `src/lib/posts.test.ts`:

```ts
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
    expect(getTagSlug('Astro 基础')).toBe('astro-%E5%9F%BA%E7%A1%80');
  });

  it('不会修改原始文章数组', () => {
    const sorted = sortPostsByDate(posts);
    expect(sorted).not.toBe(posts);
    expect(posts[0].slug).toBe('older-post');
  });
});
```

- [x] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/lib/posts.test.ts`

Expected: FAIL，错误包含 `Cannot find module './posts'`。

- [x] **Step 3: 实现内容集合和工具函数**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

export const collections = { blog };
```

Create `src/lib/posts.ts`:

```ts
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
  const tags = getPublishedPosts(posts).flatMap((post) => post.data.tags ?? []);
  return Array.from(new Set(tags));
}

export function getTagSlug(tag: string): string {
  return encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
```

Create `src/content/blog/hello-astro.md`:

```md
---
title: "用 Astro 开始写作"
description: "记录这个个人博客的第一篇文章。"
pubDate: 2026-06-05
category: "技术"
tags: ["Astro", "博客"]
draft: false
featured: true
---

# 用 Astro 开始写作

这是博客的第一篇示例文章，用来验证 Markdown 渲染、代码块、引用和列表。

## 为什么选择 Astro

Astro 适合内容型静态站点，也适合把文章保存在 Git 里。

```ts
const site = 'jockie_website';
console.log(site);
```

> 写作系统越简单，越容易长期坚持。

- Markdown 写作
- 静态部署
- 后续可升级 MDX
```

Create `src/content/blog/reading-notes.md`:

```md
---
title: "一篇读书笔记示例"
description: "展示混合型内容中的读书笔记。"
pubDate: 2026-06-04
category: "读书"
tags: ["读书", "笔记"]
draft: false
featured: false
---

# 一篇读书笔记示例

这里可以记录书中的观点、自己的理解和后续行动。

| 主题 | 记录 |
| --- | --- |
| 观点 | 用自己的话重述才算理解 |
| 行动 | 写一篇短笔记 |
```

Create `src/content/blog/draft-note.md`:

```md
---
title: "不会发布的草稿"
description: "这个文件用于验证草稿不会出现在生产列表和 RSS 中。"
pubDate: 2026-06-06
category: "随笔"
tags: ["草稿"]
draft: true
featured: true
---

# 不会发布的草稿

这篇文章只用于验证 `draft: true` 的过滤逻辑。
```

- [x] **Step 4: 运行单元测试确认通过**

Run: `npm run test -- src/lib/posts.test.ts`

Expected: PASS，5 个测试通过。

- [x] **Step 5: 提交内容模型和工具函数**

```bash
git add src/content.config.ts src/content/blog src/lib/posts.ts src/lib/posts.test.ts
git commit -m "feat: add markdown content model"
```

## Task 3: 创建共享布局和展示组件

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/Layout.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/TagList.astro`
- Create: `src/components/ProfileIntro.astro`
- Create: `src/components/SectionHeader.astro`

- [x] **Step 1: 创建全局样式**

Create `src/styles/global.css`:

```css
:root {
  color-scheme: light;
  --color-bg: #fbfaf7;
  --color-surface: #ffffff;
  --color-text: #202124;
  --color-muted: #6b7280;
  --color-border: #dedbd2;
  --color-accent: #2563eb;
  --color-accent-soft: #eff6ff;
  --color-code-bg: #f4f4f5;
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: 1.7;
}

a {
  color: inherit;
  text-decoration-color: color-mix(in srgb, var(--color-accent), transparent 55%);
  text-underline-offset: 0.2em;
}

a:hover {
  color: var(--color-accent);
}

img {
  display: block;
  max-width: 100%;
}

.site-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header,
.site-footer,
.main-content {
  width: min(100% - 32px, 1040px);
  margin-inline: auto;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0;
}

.brand {
  font-weight: 700;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  color: var(--color-muted);
  font-size: 0.95rem;
}

.nav-links a {
  text-decoration: none;
}

.main-content {
  flex: 1;
  padding: 32px 0 72px;
}

.site-footer {
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.9rem;
  padding: 28px 0;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(240px, 0.6fr);
  gap: 32px;
  align-items: end;
  padding: 40px 0 52px;
  border-bottom: 1px solid var(--color-border);
}

.hero h1 {
  margin: 0;
  font-size: clamp(2.2rem, 6vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.hero p {
  margin: 18px 0 0;
  color: var(--color-muted);
  font-size: 1.1rem;
  max-width: 680px;
}

.topic-list,
.link-list,
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
  list-style: none;
}

.pill,
.tag-link {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0 12px;
  background: var(--color-surface);
  color: var(--color-muted);
  font-size: 0.9rem;
  text-decoration: none;
}

.section {
  padding: 44px 0 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.35rem;
}

.section-header p {
  margin: 6px 0 0;
  color: var(--color-muted);
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.post-list {
  display: grid;
  gap: 14px;
}

.post-card {
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 18px;
  background: var(--color-surface);
  text-decoration: none;
}

.post-card h3 {
  margin: 0;
  font-size: 1.1rem;
}

.post-card p {
  margin: 10px 0 0;
  color: var(--color-muted);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  color: var(--color-muted);
  font-size: 0.88rem;
}

.article {
  width: min(100%, 720px);
  margin-inline: auto;
}

.article header {
  margin-bottom: 36px;
}

.article h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.12;
  letter-spacing: 0;
}

.article-body :where(h2, h3) {
  margin-top: 2em;
  line-height: 1.25;
}

.article-body :where(pre, table) {
  overflow-x: auto;
}

.article-body pre {
  border-radius: 8px;
  padding: 16px;
  background: var(--color-code-bg);
}

.article-body code {
  font-family: var(--font-mono);
}

.article-body blockquote {
  margin-left: 0;
  border-left: 3px solid var(--color-accent);
  padding-left: 16px;
  color: var(--color-muted);
}

.article-body table {
  width: 100%;
  border-collapse: collapse;
}

.article-body th,
.article-body td {
  border: 1px solid var(--color-border);
  padding: 8px 10px;
  text-align: left;
}

@media (max-width: 720px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-links {
    width: 100%;
    justify-content: space-between;
  }

  .hero,
  .post-grid {
    grid-template-columns: 1fr;
  }
}
```

- [x] **Step 2: 创建组件**

Create `src/components/Layout.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const siteName = 'Jockie';
const { title = siteName, description = 'Jockie 的个人主页和混合型博客。' } = Astro.props;
const pageTitle = title === siteName ? siteName : `${title} | ${siteName}`;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="alternate" type="application/rss+xml" title="Jockie RSS" href="/rss.xml" />
    <title>{pageTitle}</title>
  </head>
  <body>
    <div class="site-shell">
      <header class="site-header">
        <a class="brand" href="/">Jockie</a>
        <nav class="nav-links" aria-label="主导航">
          <a href="/blog">文章</a>
          <a href="/tags">标签</a>
          <a href="/about">关于</a>
          <a href="/rss.xml">RSS</a>
        </nav>
      </header>
      <main class="main-content">
        <slot />
      </main>
      <footer class="site-footer">
        <span>© 2026 Jockie. Built with Astro.</span>
      </footer>
    </div>
  </body>
</html>
```

Create `src/components/TagList.astro`:

```astro
---
import { getTagSlug } from '../lib/posts';

interface Props {
  tags: string[];
}

const { tags } = Astro.props;
---

<ul class="tag-cloud" aria-label="标签">
  {tags.map((tag) => <li><a class="tag-link" href={`/tags/${getTagSlug(tag)}`}>{tag}</a></li>)}
</ul>
```

Create `src/components/PostCard.astro`:

```astro
---
import type { BlogPostLike } from '../lib/posts';
import { formatDate } from '../lib/posts';
import TagList from './TagList.astro';

interface Props {
  post: BlogPostLike;
}

const { post } = Astro.props;
---

<article class="post-card">
  <a href={`/blog/${post.slug}`}>
    <h3>{post.data.title}</h3>
    <p>{post.data.description}</p>
  </a>
  <div class="post-meta">
    <span>{formatDate(post.data.pubDate)}</span>
    <span>{post.data.category}</span>
  </div>
  <TagList tags={post.data.tags ?? []} />
</article>
```

Create `src/components/ProfileIntro.astro`:

```astro
<section class="hero">
  <div>
    <h1>Jockie 的个人主页</h1>
    <p>这里记录技术实践、项目过程、读书笔记和一些长期思考。</p>
  </div>
  <ul class="topic-list" aria-label="写作主题">
    <li><span class="pill">技术</span></li>
    <li><span class="pill">项目</span></li>
    <li><span class="pill">读书</span></li>
    <li><span class="pill">随笔</span></li>
  </ul>
</section>
```

Create `src/components/SectionHeader.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}

const { title, description, href, linkText } = Astro.props;
---

<div class="section-header">
  <div>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </div>
  {href && linkText && <a href={href}>{linkText}</a>}
</div>
```

- [x] **Step 3: 运行 Astro 检查**

Run: `npm run check`

Expected: FAIL，错误包含还没有页面入口或页面引用缺失。这是预期失败，下一任务会创建页面。

- [x] **Step 4: 提交展示基础组件**

```bash
git add src/styles/global.css src/components
git commit -m "feat: add shared blog layout components"
```

## Task 4: 实现首页、博客列表、文章详情和关于页

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Create: `src/pages/about.astro`

- [x] **Step 1: 创建页面**

Create `src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../components/Layout.astro';
import PostCard from '../components/PostCard.astro';
import ProfileIntro from '../components/ProfileIntro.astro';
import SectionHeader from '../components/SectionHeader.astro';
import { getFeaturedPosts, getPublishedPosts } from '../lib/posts';

const posts = await getCollection('blog');
const featuredPosts = getFeaturedPosts(posts).slice(0, 2);
const recentPosts = getPublishedPosts(posts).slice(0, 4);
---

<Layout title="Jockie" description="Jockie 的个人主页和混合型博客。">
  <ProfileIntro />

  <section class="section">
    <SectionHeader title="精选文章" description="优先推荐的技术、项目和笔记。" href="/blog" linkText="查看全部" />
    <div class="post-grid">
      {featuredPosts.map((post) => <PostCard post={post} />)}
    </div>
  </section>

  <section class="section">
    <SectionHeader title="最近更新" description="按发布时间排列的最新内容。" />
    <div class="post-list">
      {recentPosts.map((post) => <PostCard post={post} />)}
    </div>
  </section>

  <section class="section">
    <SectionHeader title="项目与链接" description="后续可以放 GitHub、作品、社交主页或常用入口。" />
    <ul class="link-list">
      <li><a class="pill" href="https://github.com/" rel="noreferrer">GitHub</a></li>
      <li><a class="pill" href="/about">关于我</a></li>
      <li><a class="pill" href="/rss.xml">RSS</a></li>
    </ul>
  </section>
</Layout>
```

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../components/Layout.astro';
import PostCard from '../../components/PostCard.astro';
import SectionHeader from '../../components/SectionHeader.astro';
import { getPublishedPosts } from '../../lib/posts';

const posts = getPublishedPosts(await getCollection('blog'));
---

<Layout title="文章" description="Jockie 的全部已发布文章。">
  <section class="section">
    <SectionHeader title="文章" description="技术、项目、读书和随笔的混合记录。" />
    <div class="post-list">
      {posts.map((post) => <PostCard post={post} />)}
    </div>
  </section>
</Layout>
```

Create `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import Layout from '../../components/Layout.astro';
import TagList from '../../components/TagList.astro';
import { formatDate, getPublishedPosts } from '../../lib/posts';

export async function getStaticPaths() {
  const posts = getPublishedPosts(await getCollection('blog'));
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<Layout title={post.data.title} description={post.data.description}>
  <article class="article">
    <header>
      <h1>{post.data.title}</h1>
      <div class="post-meta">
        <span>{formatDate(post.data.pubDate)}</span>
        {post.data.updatedDate && <span>更新于 {formatDate(post.data.updatedDate)}</span>}
        <span>{post.data.category}</span>
      </div>
      <TagList tags={post.data.tags ?? []} />
    </header>
    <div class="article-body">
      <Content />
    </div>
  </article>
</Layout>
```

Create `src/pages/about.astro`:

```astro
---
import Layout from '../components/Layout.astro';
---

<Layout title="关于" description="关于 Jockie 和这个个人博客。">
  <article class="article">
    <header>
      <h1>关于</h1>
      <p>这里是更完整的个人介绍，也可以放联系方式、当前关注的问题和项目入口。</p>
    </header>
    <div class="article-body">
      <h2>这个站点写什么</h2>
      <p>这个博客会混合记录技术文章、项目过程、读书笔记和个人随笔。</p>
      <h2>写作原则</h2>
      <p>优先写清楚真实问题、具体过程和可复用的经验。</p>
    </div>
  </article>
</Layout>
```

- [x] **Step 2: 运行检查和构建**

Run: `npm run check`

Expected: PASS。

Run: `npm run build`

Expected: PASS，输出包含生成 `/`, `/blog`, `/blog/hello-astro`, `/blog/reading-notes`, `/about`，不包含 `/blog/draft-note`。

- [x] **Step 3: 提交核心页面**

```bash
git add src/pages/index.astro src/pages/blog src/pages/about.astro
git commit -m "feat: add homepage and blog pages"
```

## Task 5: 实现标签页和 RSS

**Files:**
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/rss.xml.ts`

- [x] **Step 1: 创建标签和 RSS 页面**

Create `src/pages/tags/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../components/Layout.astro';
import SectionHeader from '../../components/SectionHeader.astro';
import { getAllTags, getTagSlug } from '../../lib/posts';

const tags = getAllTags(await getCollection('blog'));
---

<Layout title="标签" description="按标签浏览 Jockie 的文章。">
  <section class="section">
    <SectionHeader title="标签" description="用标签跨分类浏览技术、项目、读书和随笔。" />
    <ul class="tag-cloud">
      {tags.map((tag) => <li><a class="tag-link" href={`/tags/${getTagSlug(tag)}`}>{tag}</a></li>)}
    </ul>
  </section>
</Layout>
```

Create `src/pages/tags/[tag].astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../components/Layout.astro';
import PostCard from '../../components/PostCard.astro';
import SectionHeader from '../../components/SectionHeader.astro';
import { getAllTags, getPublishedPosts, getTagSlug } from '../../lib/posts';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return getAllTags(posts).map((tag) => ({
    params: { tag: getTagSlug(tag) },
    props: { tag }
  }));
}

const { tag } = Astro.props;
const posts = getPublishedPosts(await getCollection('blog')).filter((post) =>
  (post.data.tags ?? []).some((postTag) => getTagSlug(postTag) === getTagSlug(tag))
);
---

<Layout title={`标签：${tag}`} description={`浏览标签 ${tag} 下的文章。`}>
  <section class="section">
    <SectionHeader title={`标签：${tag}`} description="这个标签下的全部已发布文章。" href="/tags" linkText="全部标签" />
    <div class="post-list">
      {posts.map((post) => <PostCard post={post} />)}
    </div>
  </section>
</Layout>
```

Create `src/pages/rss.xml.ts`:

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context) {
  const posts = getPublishedPosts(await getCollection('blog'));

  return rss({
    title: 'Jockie',
    description: 'Jockie 的个人主页和混合型博客。',
    site: context.site ?? 'https://jockie.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}`
    }))
  });
}
```

- [x] **Step 2: 运行检查和构建**

Run: `npm run check`

Expected: PASS。

Run: `npm run build`

Expected: PASS，输出包含 `/tags`, 至少一个 `/tags/<tag>` 和 `/rss.xml`。

- [x] **Step 3: 提交标签和 RSS**

```bash
git add src/pages/tags src/pages/rss.xml.ts
git commit -m "feat: add tags and rss feed"
```

## Task 6: 增加端到端验证

**Files:**
- Create: `tests/site.spec.ts`

- [x] **Step 1: 写 Playwright 检查**

Create `tests/site.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('首页展示个人主页内容和文章入口', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Jockie 的个人主页' })).toBeVisible();
  await expect(page.getByRole('link', { name: '文章' })).toBeVisible();
  await expect(page.getByText('用 Astro 开始写作')).toBeVisible();
});

test('博客列表展示已发布文章并隐藏草稿', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.getByText('用 Astro 开始写作')).toBeVisible();
  await expect(page.getByText('一篇读书笔记示例')).toBeVisible();
  await expect(page.getByText('不会发布的草稿')).toHaveCount(0);
});

test('文章详情页渲染 Markdown 内容', async ({ page }) => {
  await page.goto('/blog/hello-astro');
  await expect(page.getByRole('heading', { name: '用 Astro 开始写作' })).toBeVisible();
  await expect(page.getByText('写作系统越简单')).toBeVisible();
  await expect(page.locator('pre code')).toContainText('const site');
});

test('标签页只展示对应标签文章', async ({ page }) => {
  await page.goto('/tags/astro');
  await expect(page.getByText('用 Astro 开始写作')).toBeVisible();
  await expect(page.getByText('一篇读书笔记示例')).toHaveCount(0);
});

test('RSS 只包含已发布文章', async ({ page }) => {
  const response = await page.goto('/rss.xml');
  expect(response?.ok()).toBe(true);
  const body = await page.locator('body').textContent();
  expect(body).toContain('用 Astro 开始写作');
  expect(body).not.toContain('不会发布的草稿');
});
```

- [x] **Step 2: 安装 Playwright 浏览器**

Run: `npx playwright install chromium`

Expected: chromium 安装完成，退出码为 0。

- [x] **Step 3: 运行端到端检查**

Run: `npm run test:e2e`

Expected: PASS，desktop 和 mobile 两个 project 都通过。

- [x] **Step 4: 运行完整验证**

Run: `npm run test`

Expected: PASS。

Run: `npm run build`

Expected: PASS。

- [x] **Step 5: 提交端到端验证**

```bash
git add tests/site.spec.ts
git commit -m "test: add blog site checks"
```

## Task 7: 最终收尾和开发服务器

**Files:**
- Modify: `README.md`

- [x] **Step 1: 补充 README 结构说明**

Modify `README.md`:

```md
# jockie_website

个人主页型博客，基于 Astro 和 Markdown。

## 常用命令

```bash
npm install
npm run dev
npm run check
npm run test
npm run build
npm run test:e2e
```

## 内容写作

文章放在 `src/content/blog/`，使用 Markdown 和 frontmatter 管理标题、摘要、日期、分类、标签、草稿和精选状态。

```yaml
title: "文章标题"
description: "文章摘要"
pubDate: 2026-06-05
category: "技术"
tags: ["Astro", "博客"]
draft: false
featured: true
```

## 目录结构

- `src/content/blog/`：Markdown 文章。
- `src/pages/`：页面路由。
- `src/components/`：展示组件。
- `src/lib/posts.ts`：文章工具函数。
- `src/styles/global.css`：全局样式。
```

- [x] **Step 2: 运行最终验证**

Run: `npm run check`

Expected: PASS。

Run: `npm run test`

Expected: PASS。

Run: `npm run build`

Expected: PASS。

Run: `npm run test:e2e`

Expected: PASS。

- [x] **Step 3: 提交 README 收尾**

```bash
git add README.md
git commit -m "docs: document blog workflow"
```

- [x] **Step 4: 启动开发服务器**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Astro dev server starts and prints a local URL like `http://127.0.0.1:4321/`.

- [x] **Step 5: 报告结果**

Final response should include:

- 本地预览 URL。
- 已完成的主要页面。
- 已运行并通过的验证命令。
- 当前分支和提交状态。

## 自检结果

- Spec coverage: 覆盖了 Astro 脚手架、首页、文章列表、文章详情、标签、关于页、RSS、SEO、响应式、Markdown 内容模型、草稿过滤和验证要求。
- Placeholder scan: 未发现占位句、延后实现描述或缺少代码的实现步骤。
- Type consistency: `BlogPostLike`、`getPublishedPosts`、`getFeaturedPosts`、`getAllTags`、`getTagSlug`、`formatDate` 在测试、组件和页面中的名称保持一致。
