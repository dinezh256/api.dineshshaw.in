import type { Request, Response } from "express";
import { getViewCount, incrementViewCount } from "../services/viewService.js";

export const getViewCountHandler = async (req: Request, res: Response) => {
  const blogId = Number(req.params.id);
  const result = await getViewCount(blogId);

  // Cache at Vercel edge: serve from cache for 60s, revalidate in background for 120s
  res.set("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  res.status(200).send(result);
};

export const incrementViewCountHandler = async (req: Request, res: Response) => {
  const blogId = Number(req.params.id);
  const result = await incrementViewCount(blogId);

  res.status(200).send(result);
};
