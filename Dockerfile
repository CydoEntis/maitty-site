# The VPS pulls this image from GHCR; deploy/README.md has the server side.
# The site is plain files, so there is no build stage.
FROM caddy:2.11-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY site /srv
