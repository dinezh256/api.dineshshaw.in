This serves as the backend of my [portfolio](https://dineshshaw.in)

Check its status [here](https://api.dineshshaw.in)

![Banner](https://github.com/dinezh256/api.dineshshaw.in/blob/main/public/Preview.png)

## Plan

- Store the blogs in database
- Add capability for user interactions in blogs in the form of Likes

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `NODE_ENV=development`.
3. Fill in your MongoDB connection values, `CORS_ORIGINS`, and `JWT_PRIVATE_KEY` if auth is enabled.
4. Run `pnpm install` and `pnpm dev`.

The app now validates required environment variables at startup and exits early when configuration is invalid.

## Production notes

- API traffic is globally rate-limited, with stricter limits available for auth and view increment routes.
- `CORS_ORIGINS` is required explicitly for every environment.
- Request body size is capped through `JSON_BODY_LIMIT`.
- Trusted proxy hop count is configurable through `TRUST_PROXY_HOPS` for deployments behind Vercel or another reverse proxy.
- Auth routes are feature-flagged with `ENABLE_AUTH_ROUTES` and require `JWT_PRIVATE_KEY` before startup succeeds.
- View-count reads can use a short-lived in-process cache via `VIEW_COUNT_CACHE_TTL_MS`, but it defaults to `0` and is only used outside production-safe paths for single-process development scenarios.
- Local/server startup uses [src/server.ts](/Users/dineshshaw/Documents/projects/portfolio-backend/src/server.ts), while Vercel uses [src/api.ts](/Users/dineshshaw/Documents/projects/portfolio-backend/src/api.ts) so database initialization still happens in both environments.
