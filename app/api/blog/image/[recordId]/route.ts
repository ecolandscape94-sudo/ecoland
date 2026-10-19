import { getPublishedBlogImage } from '@/lib/blog';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ recordId: string }> }) {
  try {
    const { recordId } = await params;
    const image = await getPublishedBlogImage(recordId);
    if (!image) return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return new Response(image.bytes, {
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(null, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
