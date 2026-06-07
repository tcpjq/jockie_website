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

## 评论配置

文章详情页已接入 Giscus 评论组件。Giscus 使用 GitHub Discussions 存储评论，不需要数据库密码，也不需要把任何密钥提交到仓库。

需要先在 GitHub 仓库开启 Discussions，并安装 Giscus GitHub App。然后在部署环境中配置这些公开变量：

```bash
PUBLIC_GISCUS_REPO=tcpjq/jockie_website
PUBLIC_GISCUS_REPO_ID=R_kgDOSyDu2w
PUBLIC_GISCUS_CATEGORY=Announcements
PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOSyDu284C-qek
```

这些 ID 是公开标识，不是账户密码。推荐用 <https://giscus.app/zh-CN> 生成配置，再把对应值填到 GitHub Actions 或部署平台的环境变量里。缺少配置时，文章页会显示配置提示，不会加载评论脚本。
