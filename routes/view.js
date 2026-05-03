const express = require("express");
const rateLimit = require("express-rate-limit");

const { View } = require("../models/view");

const router = express.Router();

// Rate limit POST requests: max 30 per minute per IP
const viewIncrementLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Validate that :id is a positive integer
const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 0) {
    return res.status(400).send({ message: "Invalid blog ID. Must be a non-negative integer." });
  }
  req.blogId = id;
  next();
};

// GET /api/views/:id — Retrieve view count
router.get("/:id", validateId, async (req, res) => {
  try {
    const views = await View.findOne({ blogId: req.blogId });

    if (!views) {
      return res.status(404).send({ message: "Blog not found." });
    }

    // Cache at Vercel edge: serve from cache for 60s, revalidate in background for 120s
    res.set("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    res.status(200).send({ count: views.count });
  } catch (error) {
    console.error("Error fetching view count:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// POST /api/views/:id — Increment view count
router.post("/:id", viewIncrementLimiter, validateId, async (req, res) => {
  try {
    const doc = await View.findOneAndUpdate(
      { blogId: req.blogId },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).send({ message: "Views counter incremented", count: doc.count });
  } catch (error) {
    console.error("Error incrementing view count:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
