# POC (Proof of concept) on authentication management with Keycloak API

## Requirements

- Docker
- Docker compose v2


## Launching necessary stack

```sh
cd configurator
docker compose up -d postgres traefik
# Wait 5 seconds
docker compose up -d
```

## Access to local services

- [Keycloak](http://keycloak.localhost)
- [Traefik](http://traefik.localhost)
