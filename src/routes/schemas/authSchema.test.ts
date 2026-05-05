import test from "node:test";
import assert from "node:assert/strict";
import { loginSchema, signupSchema } from "./authSchema.js";

test("signupSchema normalizes email and trims names", () => {
  const parsed = signupSchema.parse({
    body: {
      firstName: "  Dinesh  ",
      lastName: "  Shaw ",
      email: "  User@Example.com ",
      password: "StrongPass1!",
    },
  });

  assert.equal(parsed.body.firstName, "Dinesh");
  assert.equal(parsed.body.lastName, "Shaw");
  assert.equal(parsed.body.email, "user@example.com");
});

test("loginSchema normalizes email", () => {
  const parsed = loginSchema.parse({
    body: {
      email: "  User@Example.com ",
      password: "secret",
    },
  });

  assert.equal(parsed.body.email, "user@example.com");
});
