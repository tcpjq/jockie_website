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
});
