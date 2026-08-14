# OpenWolf

@.wolf/OPENWOLF.md

This project uses OpenWolf for context management. Read and follow .wolf/OPENWOLF.md every session. Check .wolf/cerebrum.md before generating code. Check .wolf/anatomy.md before reading files.


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Node.js/TypeScript REST API (Express + TypeORM + PostgreSQL), built as a DDD-style study project (JWT auth, Redis cache/session invalidation, S3-compatible or local file storage, email via Nodemailer).

## Commands

```bash
yarn dev                    # dev server, ts-node-dev, hot reload, debugger on --inspect
yarn build                  # tsc + tsc-alias + copy .env -> build/ (production build)
yarn build-local            # tsc + tsc-alias, no .env copy
yarn start                  # run compiled build/src/shared/infra/http/server.js

yarn test                   # run all jest tests
yarn test -- CreateProjectService.spec.ts   # run a single test file
yarn test -- -t "should be able to create"  # run tests matching a name

yarn lint                   # eslint, zero warnings allowed
yarn lint:fix
yarn format                 # prettier --write src/**/*.ts tests/**/*.ts
yarn format:check

yarn up                     # docker-compose up (postgres, redis, etc.)

yarn migration:create -n <Name>     # empty migration
yarn migration:generate -n <Name>   # generate from entity diff
yarn migration:run
yarn migration:revert
```

TypeORM CLI config lives in `ormconfig.ts` (root) — used by the `typeorm-ts-node-commonjs` driver for migration commands, separate from the runtime connection at `src/shared/infra/typeorm/index.ts`.

## Path aliases

`tsconfig.json` defines aliases used everywhere instead of relative imports: `@shared/*`, `@modules/*`, `@config/*`, `@utils/*`, `@tests/*`, `@docs/*`. Runtime resolution is via `tsconfig-paths/register` (dev) and `tsc-alias` (build). Jest resolves the same aliases via `jest.config.ts` moduleNameMapper — check both if adding a new alias.

## Architecture

DDD-flavored modular structure under `src/modules/<domain>/` (currently `users`, `projects`, `tags`, `audit`). Each module follows the same internal layering:

- `domain/models/` — plain interfaces describing entity shape and DTOs for create/update operations (`ICreateX`, `IUpdateX`, `IX`)
- `domain/repositories/` — repository *interfaces* (`IXRepository`) that services depend on, never the TypeORM implementation directly
- `infra/typeorm/entities/` — TypeORM `@Entity` classes (the actual DB models)
- `infra/typeorm/repositories/` — concrete repository implementations of the domain interfaces
- `infra/http/controllers/` — thin Express controllers; pull data off `request`, resolve a service from the tsyringe container, call `.execute()`, shape the response
- `infra/http/routes/` — wires `isAuthenticated` middleware + `requestValidation(schema)` + controller method per route
- `infra/http/schemas/` — one `yup` schema per action (e.g. `ICreateProjectSchema.ts` exports `projectCreateSchema`), validated against `{ body, params, query }` via `requestValidation`
- `services/` — one class per use case (`CreateProjectService`, `UpdateProjectService`, etc.), each with a single `execute()` method; business rules and cross-repository checks live here, not in controllers
- `mapper(s)/` — converts between TypeORM entities and domain/DTO shapes returned by services
- `dtos/` — response-facing DTOs

Dependency injection: `tsyringe`. All repositories and providers are registered as singletons in `src/shared/container/index.ts` under string tokens (e.g. `'UsersRepository'`, `'CacheProvider'`). Services declare `@injectable()` and `@inject('Token')` constructor params, then get resolved with `container.resolve(SomeService)` in controllers — never instantiated with `new` outside tests. `container/index.ts` also branches provider selection by env: `EtherealEmailProvider` in development vs `NodeMailerProvider` otherwise, and `MinioStorageProvider` vs `LocalStorageProvider` based on `STORAGE_DISK`.

`src/shared/` holds cross-module infrastructure:
- `providers/` — swappable implementations behind interfaces (cache, cryptography, cookie, email, jwt, logs, storage), each with `models/IX.ts` (interface) + `implementations/X.ts`
- `infra/http/app.ts` — Express app assembly: cors, cookie-parser, rate limiter, `typeorm-pagination` middleware, mounted routes, a raw `/files/:filename` streaming route, then `ErrorHandler` last
- `infra/http/middleware/` — `isAuthenticated` (reads `access_token` cookie, verifies JWT, cross-checks a `jti` against Redis session cache falling back to `UsersTokensRepository`), `requestValidation` (yup schema middleware via celebrate-style pattern), rate limiters
- `infra/typeorm/migrations/` — timestamped TypeORM migrations
- `errors/AppError.ts` — the only expected thrown error type; carries `message`, `context`, `statusCode`. `ErrorHandler` (mounted last in `app.ts`) formats `AppError` responses and logs everything else as a 500 with a generated `errorId`, via the injected `LogProvider`.

Auth model: JWT access token in an httpOnly cookie (`access_token`), refresh token flow via `RefreshTokenService` (registered as a transient/non-singleton in the container — a new instance per resolve), session invalidation tracked by `jti` in Redis (`CacheProvider`) with DB fallback (`UsersTokensRepository`).

## Testing

Jest + ts-jest, tests under `tests/`, mirroring `src/modules/<domain>/unit/*.spec.ts`. Services are tested with **fakes**, not mocks/DB: `tests/modules/<domain>/repositories/FakeXRepository.ts` implements the domain repository interface in-memory, and `tests/providers/fakes/FakeXProvider.ts` implements provider interfaces the same way. Services under test are constructed directly with `new` and fakes passed into the constructor (bypassing tsyringe entirely) — see any `*.spec.ts` for the pattern. Only unit tests exist currently; integration/E2E are still on the roadmap (see README checklist).

## Security roadmap

`ROADMAP.md` tracks a staged security/infra roadmap (MVP → full secrets manager). Check it before making auth/secrets/infra changes to understand what stage the project is currently targeting.
