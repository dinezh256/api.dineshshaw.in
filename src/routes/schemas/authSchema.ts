import { z } from "zod";

const normalizedEmail = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
  z.email({ message: "Invalid Email" }),
);

const trimmedName = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .max(100, `${fieldName} is too long`);

export const signupSchema = z.object({
  body: z.object({
    firstName: trimmedName("First Name"),
    lastName: trimmedName("Last Name"),
    email: normalizedEmail,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must be at most 128 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character",
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: normalizedEmail,
    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Password is too long"),
  }),
});
