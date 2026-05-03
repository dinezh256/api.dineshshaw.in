import express, { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/user.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(1, "Password is required"),
  }),
});

router.post("/", validateRequest(loginSchema), async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).send({ message: "Invalid Email/Password" });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!validPassword) {
    return res.status(401).send({ message: "Invalid Email/Password" });
  }

  const token = user.generateAuthToken();

  res
    .status(200)
    .send({ sessionToken: token, message: "Logged in successfully." });
});

export default router;
