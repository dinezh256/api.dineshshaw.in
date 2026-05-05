import type { RequestHandler } from "express";
import { z, ZodError } from "zod";

export const validateRequest = (schema: z.ZodType) => {
  const middleware: RequestHandler = async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;

      // Use defineProperty because Express 5 request properties are often read-only getters
      Object.defineProperty(req, "body", { value: parsed.body, configurable: true });
      Object.defineProperty(req, "query", { value: parsed.query, configurable: true });
      Object.defineProperty(req, "params", { value: parsed.params, configurable: true });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).send({
          message: "Validation Error",
          details: error.issues.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }
      console.error("Validation Middleware Error:", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  return middleware;
};
