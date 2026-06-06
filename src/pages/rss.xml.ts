import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts } from '../lib/posts';
import { sitePath } from '../lib/urls';

export async function GET(context: APIContext) {
  const posts = getPublishedPosts(await getCollection('blog'));
  const site = new URL(sitePath(), context.site ?? 'https://tcpjq.github.io');

  return rss({
    title: 'Jockie',
    description: 'Jockie 的个人主页和混合型博客。',
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: sitePath(`blog/${post.slug}`)
    }))
  });
}
