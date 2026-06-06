import { expect, test } from '@playwright/test';

const sitePath = (path = '') => `/jockie_website${path ? `/${path}` : '/'}`;

test('首页展示个人主页内容和文章入口', async ({ page }) => {
  await page.goto(sitePath());
  await expect(page.getByRole('heading', { name: 'Jockie 的个人主页' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '文章' })).toBeVisible();
  await expect(page.getByRole('link', { name: /用 Astro 开始写作/ }).first()).toBeVisible();
});

test('博客列表展示已发布文章并隐藏草稿', async ({ page }) => {
  await page.goto(sitePath('blog'));
  await expect(page.getByText('用 Astro 开始写作')).toBeVisible();
  await expect(page.getByText('一篇读书笔记示例')).toBeVisible();
  await expect(page.getByText('不会发布的草稿')).toHaveCount(0);
});

test('文章详情页渲染 Markdown 内容', async ({ page }) => {
  await page.goto(sitePath('blog/hello-astro'));
  await expect(page.locator('article > header').getByRole('heading', { name: '用 Astro 开始写作' })).toBeVisible();
  await expect(page.getByText('写作系统越简单')).toBeVisible();
  await expect(page.locator('pre code')).toContainText('const site');
});

test('标签页只展示对应标签文章', async ({ page }) => {
  await page.goto(sitePath('tags/astro'));
  await expect(page.getByText('用 Astro 开始写作')).toBeVisible();
  await expect(page.getByText('一篇读书笔记示例')).toHaveCount(0);
});

test('RSS 只包含已发布文章', async ({ page }) => {
  const response = await page.goto(sitePath('rss.xml'));
  expect(response?.ok()).toBe(true);
  const body = await page.locator('body').textContent();
  expect(body).toContain('用 Astro 开始写作');
  expect(body).not.toContain('不会发布的草稿');
});
