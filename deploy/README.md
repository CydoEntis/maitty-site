# Deploy

The site runs on the VPS as one container behind the host's Caddy, the same
way as snipux.com.

1. A push to `main` runs `.github/workflows/ci.yml`: `astro check`, the
   build, and a check that every local link in `dist/` exists. When those
   pass it builds the `Dockerfile` (a Node stage runs the Astro build, then
   `caddy:2.11-alpine` serves `dist/`) for linux/amd64 and pushes
   `ghcr.io/cydoentis/maitty-site:main` (and `:<commit sha>`).
2. On the server, `/srv/maitty` holds `docker-compose.yml` from this folder.
   `maitty-update.timer` runs `maitty-update.service` every 5 minutes, which
   pulls and restarts the container, so a green push is live within 5 minutes.
3. The container serves the site on `127.0.0.1:8083` (snipux.com has 8082).
   The host's Caddy adds HTTPS.

## First time

1. **Port.** Check 8083 is free: `ss -ltnp | grep 8083` should print nothing.
   If it is taken, change the port here, in `docker-compose.yml` and in the
   Caddy block below.
2. **Image.** Push `main` once so CI publishes the image. Then either make the
   GHCR package `maitty-site` public (GitHub › Packages › maitty-site ›
   Package settings › Change visibility), or log the server in with a classic
   token that has only `read:packages`:
   ```sh
   sudo docker login ghcr.io -u <github-user> --password-stdin
   ```
   (`sudo`, because the update timer runs as root.)
3. **Stack folder.**
   ```sh
   sudo mkdir -p /srv/maitty
   sudo cp deploy/docker-compose.yml /srv/maitty/
   cd /srv/maitty && sudo docker compose up -d
   curl -sI http://127.0.0.1:8083/ | head -1   # HTTP/1.1 200 OK
   ```
4. **Update timer.**
   ```sh
   sudo cp deploy/maitty-update.service deploy/maitty-update.timer /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now maitty-update.timer
   ```
5. **DNS** on Porkbun, for both `maitty.app` and `www`: A to `40.160.103.45`,
   AAAA to `2604:2dc0:101:200::3b68`. Wait until `dig +short maitty.app`
   answers before the next step, or Caddy's certificate request fails.
6. **Caddy.** Add to `/etc/caddy/Caddyfile`, then `sudo systemctl reload caddy`:
   ```
   maitty.app {
       encode zstd gzip
       reverse_proxy 127.0.0.1:8083
   }
   www.maitty.app {
       redir https://maitty.app{uri} permanent
   }
   ```
   `.app` is HSTS-preloaded, so the site only works over HTTPS; Caddy's
   certificate covers that.

## Day to day

- Force an update now: `sudo systemctl start maitty-update.service`
- Roll back: pin `image:` in `/srv/maitty/docker-compose.yml` to a commit tag
  (`ghcr.io/cydoentis/maitty-site:<sha>`) and run the update service.
- shortcut: the server does not pick up changes to `deploy/docker-compose.yml`;
  copy it to `/srv/maitty/` by hand when it changes.

Try the image locally:

```sh
docker build -t maitty-site .
docker run --rm -p 8083:8080 maitty-site   # http://localhost:8083
```
