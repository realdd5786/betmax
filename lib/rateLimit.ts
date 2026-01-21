const windowMs = 60 * 1000;
const maxRequests = 5;

type Entry = { count: number; start: number };

const store = new Map<string, Entry>();

export function rateLimit(key: string) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.start > windowMs) {
    store.set(key, { count: 1, start: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, remaining: maxRequests - entry.count };
}
