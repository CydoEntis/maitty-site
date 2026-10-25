# Deploy

The site runs on the VPS as one container behind the host's Caddy, the same
way as snipux.com.

1. A push to `main` runs `.github/workflows/ci.yml`. When the checks pass it
   builds the `Dockerfile` for linux/amd64 and pushes
   `ghcr.io/cydoentis/maitty-site:main`.
2. On the server, `/srv/maitty` holds `docker-compose.yml` from this folder.
   An update timer runs `docker compose pull && docker compose up -d` every
   5 minutes, so the new image goes live within 5 minutes of a green push.
3. The container serves the site on `127.0.0.1:8083` (snipux.com has 8082).
   The host's `/etc/caddy/Caddyfile` adds HTTPS:

   ```
   maitty.app {
       encode zstd gzip
       reverse_proxy 127.0.0.1:8083
   }
   www.maitty.app {
       redir https://maitty.app{uri} permanent
   }
   ```

DNS for maitty.app: A records to `40.160.103.45` and AAAA to
`2604:2dc0:101:200::3b68`, for both `maitty.app` and `www`. `.app` is
HSTS-preloaded, so the site only works over HTTPS; Caddy's certificate covers
that.

Try the image locally:

```sh
docker build -t maitty-site .
docker run --rm -p 8083:8080 maitty-site   # http://localhost:8083
```
