import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context: APIContext) {
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
