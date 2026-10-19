import 'server-only';
import { unstable_cache } from 'next/cache';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  hasImage: boolean;
};

type AirtableRecord = {
  id: string;
  fields?: {
    Title?: unknown;
    Date?: unknown;
    image?: unknown;
    Content?: unknown;
    Published?: unknown;
  };
};

const airtableSettings = () => ({
  token: process.env.AIRTABLE_TOKEN,
  baseId: process.env.AIRTABLE_BASE_ID,
  tableId: process.env.AIRTABLE_TABLE_ID,
});

function slugify(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const { token, baseId, tableId } = airtableSettings();
  if (!token || !baseId || !tableId) return [];

  const posts: BlogPost[] = [];
  let offset: string | undefined;
  do {
    const query = new URLSearchParams({
      pageSize: '100',
      filterByFormula: '({Published}=1)',
      'sort[0][field]': 'Date',
      'sort[0][direction]': 'desc',
    });
    if (offset) query.set('offset', offset);
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Airtable blog request failed (${response.status})`);
    const data = await response.json() as { records?: AirtableRecord[]; offset?: string };

    for (const record of data.records || []) {
      const fields = record.fields || {};
      const title = typeof fields.Title === 'string' ? fields.Title.trim() : '';
      const date = typeof fields.Date === 'string' ? fields.Date : '';
      const content = typeof fields.Content === 'string' ? fields.Content.trim() : '';
      const attachments = Array.isArray(fields.image) ? fields.image : [];
      if (fields.Published !== true || !title || !content) continue;
      posts.push({
        id: record.id,
        slug: `${slugify(title) || 'post'}-${record.id.toLowerCase()}`,
        title,
        date,
        content,
        hasImage: attachments.some((item) => typeof item === 'object' && item !== null && typeof (item as { url?: unknown }).url === 'string'),
      });
    }
    offset = data.offset;
  } while (offset);

  return posts;
}

const cachedPublishedPosts = unstable_cache(fetchPublishedPosts, [
  'airtable-published-blog-v1',
  process.env.AIRTABLE_BASE_ID || 'unconfigured',
  process.env.AIRTABLE_TABLE_ID || 'unconfigured',
], { revalidate: 60, tags: ['airtable-blog'] });

export async function getBlogPosts() {
  try {
    return await cachedPublishedPosts();
  } catch (error) {
    console.error('Could not load published Airtable blog posts', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export async function getBlogPost(slug: string) {
  return (await getBlogPosts()).find((post) => post.slug === slug) || null;
}

export async function getPublishedBlogImage(recordId: string) {
  const { token, baseId, tableId } = airtableSettings();
  if (!token || !baseId || !tableId || !/^rec[a-zA-Z0-9]+$/.test(recordId)) return null;

  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  });
  if (!response.ok) return null;

  const record = await response.json() as AirtableRecord;
  if (record.fields?.Published !== true || !Array.isArray(record.fields.image)) return null;
  const attachment = record.fields.image.find((item) => typeof item === 'object' && item !== null && typeof (item as { url?: unknown }).url === 'string') as { url: string; type?: string } | undefined;
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
  if (!attachment || !allowedTypes.has(attachment.type || '')) return null;
  try { if (new URL(attachment.url).protocol !== 'https:') return null; } catch { return null; }

  const image = await fetch(attachment.url, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
  if (!image.ok || !allowedTypes.has(image.headers.get('content-type')?.split(';')[0] || '')) return null;
  const length = Number(image.headers.get('content-length') || 0);
  if (length > 8 * 1024 * 1024) return null;
  const reader = image.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > 8 * 1024 * 1024) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return { bytes, contentType: image.headers.get('content-type')?.split(';')[0] || 'image/jpeg' };
}
