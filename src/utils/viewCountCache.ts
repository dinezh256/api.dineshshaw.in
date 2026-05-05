type CachedViewCount = {
  count: number;
  expiresAt: number;
};

const viewCountCache = new Map<number, CachedViewCount>();

export const getCachedViewCount = (blogId: number) => {
  const cached = viewCountCache.get(blogId);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    viewCountCache.delete(blogId);
    return null;
  }

  return cached.count;
};

export const setCachedViewCount = (blogId: number, count: number, ttlMs: number) => {
  if (ttlMs <= 0) {
    viewCountCache.delete(blogId);
    return;
  }

  viewCountCache.set(blogId, {
    count,
    expiresAt: Date.now() + ttlMs,
  });
};
