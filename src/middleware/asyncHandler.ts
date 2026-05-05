import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const asyncHandler = (handler: AsyncRequestHandler) => {
  const wrappedHandler: RequestHandler = (req, res, next) => {
    void handler(req, res, next).catch((error) => next(error));
  };

  return wrappedHandler;
};
