import { getCollection } from 'astro:content';

// /llms-full.txt — pełna treść wszystkich opublikowanych notatek w jednym pliku
// tekstowym, do wczytania przez LLM. Generowana przy buildzie.
export async function GET(context: { site?: URL }) {
  const site = (context.site?.toString() ?? 'https://kowalski-ptr.github.io').replace(
    /\/$/,
    ''
  );

  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const parts: string[] = [];
  parts.push('# knowbase — full content');
  parts.push('');
  parts.push('> Engineering notebook — notes on code, infrastructure & AI.');
  parts.push('');

  for (const p of posts) {
    parts.push('---');
    parts.push('');
    parts.push(`# ${p.data.title}`);
    parts.push('');
    parts.push(`Source: ${site}/notes/${p.id}/`);
    parts.push(`Category: ${p.data.category}`);
    if (p.data.tags.length) parts.push(`Tags: ${p.data.tags.join(', ')}`);
    parts.push('');
    if (p.data.description) {
      parts.push(p.data.description);
      parts.push('');
    }
    parts.push((p.body ?? '').trim());
    parts.push('');
  }

  return new Response(parts.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
