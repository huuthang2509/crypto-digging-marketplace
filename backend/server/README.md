# Crypto Digging BE Server

## Dev environment

- NVM
- Install extension vs-code for project
- Docker
- Hasura CLI V2 [https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli)
- Node 16.13.0

## Running the local development

- Add a new line in host file: ```127.0.0.1       data.daikin-edu.nexlab```
- ```cd server && cp dotenv .env```
- Command

```shell
nvm use
```

```shell
chmod u+x scripts/bootstrap.sh
chmod u+x scripts/build-image.sh
chmod u+x scripts/migrate.sh
chmod u+x scripts/package.sh
chmod u+x scripts/seed.sh
```

```shell
make package
```

```shell
make dev
```

```shell
make bootstrap
```

- Go with: [http://data.crypto-digging.r2ws](http://data.crypto-digging.r2ws)
