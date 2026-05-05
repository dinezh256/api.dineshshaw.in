import express from "express";
import { signupHandler } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authRateLimiter } from "../middleware/rateLimit.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { signupSchema } from "./schemas/authSchema.js";

const router = express.Router();

router.post("/", authRateLimiter, validateRequest(signupSchema), asyncHandler(signupHandler));

export default router;
