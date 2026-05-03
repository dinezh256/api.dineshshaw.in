import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/user.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const signupSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid Email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  }),
});

router.post("/", validateRequest(signupSchema), async (req: express.Request, res: express.Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return res
      .status(409)
      .send({ message: "User with this email already exists." });
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT_KEY) || 10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({ ...req.body, password: hashPassword });
  await newUser.save();
  
  res.status(201).send({ message: "User Created successfully." });
});

export default router;
