import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "./app.js";
import { config } from "./config.js";

test("createApp applies core production settings", () => {
  const app = createApp();

  assert.equal(app.get("trust proxy"), config.trustProxyHops);
  assert.equal(app.disabled("x-powered-by"), true);
  assert.ok(app.router);
});
