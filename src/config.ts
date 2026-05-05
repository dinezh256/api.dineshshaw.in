import { z } from "zod";

const normalizeNodeEnv = (value: unknown) => {
  if (typeof value !== "string" || value.trim() === "") {
    return "development";
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "dev") return "development";
  if (normalized === "prod") return "production";

  return normalized;
};

const splitCorsOrigins = (value: unknown) => {
  if (typeof value !== "string") return value;
  if (value.trim() === "") return [];

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const normalizeBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
};

const envSchema = z
  .object({
    NODE_ENV: z.preprocess(normalizeNodeEnv, z.enum(["development", "test", "production"])),
    PORT: z.coerce.number().int().positive().default(3000),
    MONGODB_URL: z.string().trim().min(1).optional(),
    MONGODB_URL_LOCAL: z.string().trim().min(1).optional(),
    MONGODB_DB_NAME: z.string().trim().min(1).default("portfolio"),
    CORS_ORIGINS: z.preprocess(
      splitCorsOrigins,
      z.array(z.string().url()).min(1, "CORS_ORIGINS must include at least one origin")
    ),
    TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(1),
    JSON_BODY_LIMIT: z.string().trim().default("100kb"),
    API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
    API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
    AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
    VIEWS_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
    VIEWS_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),
    VIEW_COUNT_CACHE_TTL_MS: z.coerce.number().int().min(0).default(0),
    ENABLE_AUTH_ROUTES: z.preprocess(normalizeBoolean, z.boolean()).default(false),
    JWT_PRIVATE_KEY: z.string().trim().min(1).optional(),
    JWT_EXPIRES_IN: z.string().trim().min(1).default("7d"),
    SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(10),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "development" && !env.MONGODB_URL_LOCAL) {
      ctx.addIssue({
        code: "custom",
        path: ["MONGODB_URL_LOCAL"],
        message: "MONGODB_URL_LOCAL is required when NODE_ENV=development.",
      });
    }

    if (env.NODE_ENV !== "development" && !env.MONGODB_URL) {
      ctx.addIssue({
        code: "custom",
        path: ["MONGODB_URL"],
        message: "MONGODB_URL is required outside development.",
      });
    }

    if (env.ENABLE_AUTH_ROUTES && !env.JWT_PRIVATE_KEY) {
      ctx.addIssue({
        code: "custom",
        path: ["JWT_PRIVATE_KEY"],
        message: "JWT_PRIVATE_KEY is required when ENABLE_AUTH_ROUTES=true.",
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsedEnv.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  throw new Error("Application configuration is invalid.");
}

const env = parsedEnv.data;

export const config = {
  env: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  port: env.PORT,
  corsOrigins: env.CORS_ORIGINS,
  trustProxyHops: env.TRUST_PROXY_HOPS,
  jsonBodyLimit: env.JSON_BODY_LIMIT,
  dbName: env.MONGODB_DB_NAME,
  mongoUri: env.NODE_ENV === "development" ? env.MONGODB_URL_LOCAL! : env.MONGODB_URL!,
  rateLimit: {
    apiWindowMs: env.API_RATE_LIMIT_WINDOW_MS,
    apiMax: env.API_RATE_LIMIT_MAX,
    authWindowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
    authMax: env.AUTH_RATE_LIMIT_MAX,
    viewsWindowMs: env.VIEWS_RATE_LIMIT_WINDOW_MS,
    viewsMax: env.VIEWS_RATE_LIMIT_MAX,
  },
  views: {
    cacheTtlMs: env.VIEW_COUNT_CACHE_TTL_MS,
    useInMemoryCache: env.NODE_ENV !== "production" && env.VIEW_COUNT_CACHE_TTL_MS > 0,
  },
  auth: {
    enabled: env.ENABLE_AUTH_ROUTES,
    jwtPrivateKey: env.JWT_PRIVATE_KEY,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    saltRounds: env.SALT_ROUNDS,
  },
} as const;

export const requireJwtPrivateKey = () => {
  if (!config.auth.jwtPrivateKey) {
    throw new Error("JWT_PRIVATE_KEY must be configured before auth is used.");
  }

  return config.auth.jwtPrivateKey;
};
