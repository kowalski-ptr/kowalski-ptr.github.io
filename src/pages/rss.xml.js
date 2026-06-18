import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'knowbase — engineering notebook',
    description: 'Notes on code, infrastructure & AI.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.date,
      categories: [post.data.category, ...post.data.tags],
      link: `/notes/${post.id}/`,
    })),
    customData: `<language>en</language>`,
  });
}
