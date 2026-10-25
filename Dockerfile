# The VPS pulls this image from GHCR; deploy/README.md has the server side.
# Stage one builds the Astro site; stage two serves dist/ with Caddy.
FROM node:24.14.1-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY astro.config.mjs tsconfig.json ./
COPY public public
COPY src src
RUN pnpm build

FROM caddy:2.11-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
