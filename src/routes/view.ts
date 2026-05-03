import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { View } from "../models/view.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

// Rate limit POST requests: max 30 per minute per IP
const viewIncrementLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const viewSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => Number(val)).refine((val) => Number.isInteger(val) && val >= 0, {
      message: "Invalid blog ID. Must be a non-negative integer.",
    }),
  }),
});

// GET /api/views/:id — Retrieve view count
router.get("/:id", validateRequest(viewSchema), async (req: Request, res: Response) => {
  const blogId = Number(req.params.id);
  const views = await View.findOne({ blogId });

  if (!views) {
    return res.status(404).send({ message: "Blog not found." });
  }

  // Cache at Vercel edge: serve from cache for 60s, revalidate in background for 120s
  res.set("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  res.status(200).send({ count: views.count });
});

// POST /api/views/:id — Increment view count
router.post("/:id", viewIncrementLimiter, validateRequest(viewSchema), async (req: Request, res: Response) => {
  const blogId = Number(req.params.id);
  const doc = await View.findOneAndUpdate(
    { blogId },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  res.status(200).send({ count: doc.count });
});

export default router;
