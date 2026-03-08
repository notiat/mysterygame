const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;

type Bucket = {
  count: number;
  expiresAt: number;
};

const memoryBuckets = new Map<string, Bucket>();

export function rateLimit(key: string) {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.expiresAt < now) {
    memoryBuckets.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  memoryBuckets.set(key, bucket);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - bucket.count };
}
