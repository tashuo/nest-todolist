## todolist
a simple todolist backend program with nestjs

## Running the app
### Installation

```bash
$ cp .env.example .env
$ pnpm install
$ pnpm typeorm:run-migrations # run migrations
```
### run

```bash
# development
$ pnpm start
# watch mode
$ pnpm start:dev
# production mode
$ pnpm start:prod
```

## Running the app(Docker)

```bash
$ cp .env.example .env
$ docker-compose up
```
