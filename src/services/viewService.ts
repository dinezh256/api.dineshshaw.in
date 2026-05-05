import { AppError } from "../errors.js";
import { config } from "../config.js";
import { findViewByBlogId, incrementViewCountByBlogId } from "../repositories/viewRepository.js";
import { getCachedViewCount, setCachedViewCount } from "../utils/viewCountCache.js";

export const getViewCount = async (blogId: number) => {
  const cachedCount = config.views.useInMemoryCache ? getCachedViewCount(blogId) : null;

  if (cachedCount !== null) {
    return { count: cachedCount };
  }

  const view = await findViewByBlogId(blogId);

  if (!view) {
    throw new AppError(404, "Blog not found.", "VIEW_NOT_FOUND");
  }

  if (config.views.useInMemoryCache) {
    setCachedViewCount(blogId, view.count, config.views.cacheTtlMs);
  }
  return { count: view.count };
};

export const incrementViewCount = async (blogId: number) => {
  const view = await incrementViewCountByBlogId(blogId);

  if (!view) {
    throw new AppError(500, "Could not update view count.", "VIEW_INCREMENT_FAILED");
  }

  if (config.views.useInMemoryCache) {
    setCachedViewCount(blogId, view.count, config.views.cacheTtlMs);
  }
  return { count: view.count };
};
