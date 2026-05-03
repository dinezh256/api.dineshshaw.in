import express from "express";

const hasMongoOperators = (obj: any): boolean => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        return true;
      }
      if (hasMongoOperators(obj[key])) {
        return true;
      }
    }
  }
  return false;
};

const sanitize = (obj: any): any => {
  if (obj && typeof obj === "object") {
    const newObj: any = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (!key.startsWith("$") && !key.includes(".")) {
        newObj[key] = sanitize(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

export const mongoSanitize = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  // Note: We don't sanitize req.query or req.params here because they are handled by Zod
  // but if we wanted to, we would use Object.defineProperty as we did in validateRequest.
  next();
};
