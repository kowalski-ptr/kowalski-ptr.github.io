import { getCollection } from 'astro:content';

// /llms.txt — zwięzła mapa treści dla LLM-ów wg konwencji llmstxt.org.
// Generowana przy buildzie z opublikowanych postów.
export async function GET(context: { site?: URL }) {
  const site = (context.site?.toString() ?? 'https://kowalski-ptr.github.io').replace(
    /\/$/,
    ''
  );

  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const lines: string[] = [];
  lines.push('# knowbase');
  lines.push('');
  lines.push(
    '> Engineering notebook — notes on code, infrastructure & AI. Every note is a Markdown file in a public GitHub repo, built with Astro and served on GitHub Pages.'
  );
  lines.push('');
  lines.push(
    'Full plain-text content of all notes is available at /llms-full.txt.'
  );
  lines.push('');
  lines.push('## Notes');
  for (const p of posts) {
    const desc = p.data.description ? `: ${p.data.description}` : '';
    lines.push(`- [${p.data.title}](${site}/notes/${p.id}/)${desc}`);
  }
  lines.push('');
  lines.push('## Pages');
  lines.push(`- [About](${site}/about/): what this notebook is and how it is built`);
  lines.push(`- [Topics](${site}/tags/): all note tags`);
  lines.push('');
  lines.push('## Optional');
  lines.push(`- [RSS feed](${site}/rss.xml)`);
  lines.push(`- [Sitemap](${site}/sitemap-index.xml)`);

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
