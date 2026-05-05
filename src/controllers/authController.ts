import type { Request, Response } from "express";
import { loginUser, signupUser } from "../services/authService.js";

export const signupHandler = async (req: Request, res: Response) => {
  const result = await signupUser(req.body);
  res.status(201).send(result);
};

export const loginHandler = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).send(result);
};
