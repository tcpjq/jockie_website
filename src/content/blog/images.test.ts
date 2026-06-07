import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('blog image paths', () => {
  it('does not use root-relative public image paths that skip the GitHub Pages base path', () => {
    const articlePath = resolve('src/content/blog/knowledge-base-practice.md');
    const article = readFileSync(articlePath, 'utf-8');

    expect(article).not.toMatch(/!\[[^\]]*\]\(\/images\//);
    expect(article).not.toMatch(/!\[[^\]]*\]\(\.\.\/\.\.\/images\//);
  });

  it('publishes AI tools setup article with local images', () => {
    const articlePath = resolve('src/content/blog/ai-tools-setup.md');
    const article = readFileSync(articlePath, 'utf-8');

    expect(article).toContain('title: "AI探索：先搭工具箱，再让 AI 帮我做一个博客"');
    expect(article).toContain('draft: false');
    expect(article).not.toContain('juejin.cn');
    expect(article).toContain('![博客首页截图](./ai-tools-setup/home.png)');
    expect(article).toContain('![文章页面截图](./ai-tools-setup/article.png)');
  });
});
