import test from "node:test";
import assert from "node:assert/strict";
import type express from "express";
import { asyncHandler } from "./asyncHandler.js";

test("asyncHandler forwards rejected errors to next", async () => {
  const expectedError = new Error("boom");
  let receivedError: unknown;

  const handler = asyncHandler(async () => {
    throw expectedError;
  });

  handler(
    {} as express.Request,
    {} as express.Response,
    (error?: unknown) => {
      receivedError = error;
    }
  );

  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(receivedError, expectedError);
});
