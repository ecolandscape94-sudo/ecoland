import { createHash } from 'node:crypto';
const counters = new Map<string, { count: number; until: number }>();
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const allowed = [new URL(request.url).origin, process.env.NEXT_PUBLIC_SITE_URL, process.env.AUTH_URL].filter(Boolean);
  return !!origin && allowed.includes(origin);
}
export function rateKey(request: Request, scope: string) {
  // Vercel sets this trusted header; never trust a user-supplied X-Forwarded-For there.
  const ip = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0] || 'unknown' : request.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  return `${scope}:${createHash('sha256').update(ip).digest('hex').slice(0, 32)}`;
}
export async function rateLimit(key: string, maximum = 5, seconds = 600) {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
    const response = await fetch(process.env.UPSTASH_REDIS_REST_URL, { method: 'POST', headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(['EVAL', script, '1', `eco:${key}`, String(seconds)]), cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Rate limiting unavailable');
    const data = await response.json();
    if (typeof data.result !== 'number') throw new Error('Rate limiting unavailable');
    return data.result <= maximum;
  }
  if (process.env.VERCEL) throw new Error('Production rate limiting is not configured');
  const now = Date.now();
  if (counters.size > 10000) for (const [k, v] of counters) if (v.until < now) counters.delete(k);
  const counter = counters.get(key);
  if (!counter || counter.until < now) { counters.set(key, { count: 1, until: now + seconds * 1000 }); return true; }
  return ++counter.count <= maximum;
}
export function detectImage(bytes: Buffer): 'jpeg' | 'png' | 'webp' | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'png';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}
