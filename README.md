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
