import test from "node:test";
import assert from "node:assert/strict";
import type express from "express";
import { z } from "zod";
import { validateRequest } from "./validateRequest.js";

const schema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
  }),
  params: z.object({
    id: z.string().transform((value) => Number(value)),
  }),
  query: z.object({
    page: z.string().default("1"),
  }),
});

const createResponse = () => {
  let statusCode = 200;
  let payload: unknown;

  const response = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    send(body: unknown) {
      payload = body;
      return this;
    },
  } as Partial<express.Response>;

  return {
    response: response as express.Response,
    get statusCode() {
      return statusCode;
    },
    get payload() {
      return payload;
    },
  };
};

test("validateRequest parses and rewrites request data", async () => {
  const middleware = validateRequest(schema);
  const req = {
    body: { name: "  portfolio " },
    params: { id: "42" },
    query: {},
  } as express.Request;
  const { response } = createResponse();
  let nextCalled = false;

  await middleware(req, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, { name: "portfolio" });
  assert.deepEqual(req.params, { id: 42 });
  assert.deepEqual(req.query, { page: "1" });
});

test("validateRequest returns 400 for invalid data", async () => {
  const middleware = validateRequest(schema);
  const req = {
    body: { name: "" },
    params: { id: "42" },
    query: {},
  } as express.Request;
  const resState = createResponse();

  await middleware(req, resState.response, () => undefined);

  assert.equal(resState.statusCode, 400);
  assert.deepEqual(resState.payload, {
    message: "Validation Error",
    details: [
      {
        path: ["body", "name"],
        message: "Too small: expected string to have >=1 characters",
      },
    ],
  });
});
