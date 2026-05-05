import { View } from "../models/view.js";

export const findViewByBlogId = (blogId: number) => {
  return View.findOne({ blogId }).select({ _id: 0, count: 1 }).lean();
};

export const incrementViewCountByBlogId = (blogId: number) => {
  return View.findOneAndUpdate(
    { blogId },
    { $inc: { count: 1 }, $setOnInsert: { blogId } },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
      projection: { _id: 0, count: 1 },
      lean: true,
    }
  );
};
