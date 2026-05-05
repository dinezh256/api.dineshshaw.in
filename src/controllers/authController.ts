import express from "express";
import { loginUser, signupUser } from "../services/authService.js";

export const signupHandler = async (req: express.Request, res: express.Response) => {
  const result = await signupUser(req.body);
  res.status(201).send(result);
};

export const loginHandler = async (req: express.Request, res: express.Response) => {
  const result = await loginUser(req.body);
  res.status(200).send(result);
};
