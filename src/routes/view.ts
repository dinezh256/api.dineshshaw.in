import express from "express";
import { getViewCountHandler, incrementViewCountHandler } from "../controllers/viewController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { viewsRateLimiter } from "../middleware/rateLimit.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { viewSchema } from "./schemas/viewSchema.js";

const router = express.Router();

// GET /api/views/:id — Retrieve view count
router.get("/:id", validateRequest(viewSchema), asyncHandler(getViewCountHandler));

// POST /api/views/:id — Increment view count
router.post("/:id", viewsRateLimiter, validateRequest(viewSchema), asyncHandler(incrementViewCountHandler));

export default router;
