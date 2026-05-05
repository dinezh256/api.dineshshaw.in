import express from "express";
import { loginHandler } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authRateLimiter } from "../middleware/rateLimit.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema } from "./schemas/authSchema.js";

const router = express.Router();

router.post("/", authRateLimiter, validateRequest(loginSchema), asyncHandler(loginHandler));

export default router;
