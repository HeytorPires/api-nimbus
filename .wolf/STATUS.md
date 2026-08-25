# STATUS — api-nimbus

> Single source of truth for resuming work. Read this FIRST when starting a session.
> Update this file at the end of every work phase so the next `/clear` resumes in 1 read.
> Last updated: 2026-08-25

---

## ✅ Done

### Estrutura de testes unificada (2026-08-25)

Uma config só: `jest.config.ts` na raiz com três *projects* do Jest — `unit`, `integration`, `e2e` —
cada um com escopo declarado por `roots`. `jest.config.integration.ts` foi deletado.

```
tests/
├── unit/          modules/{users,projects,tags}, providers, shared/http
├── integration/   {auth,users,projects,tags}   (specs não se moveram)
├── e2e/           reservado, só .gitkeep
└── support/       fakes/ + helpers/ + setup/   (era espalhado em 4 lugares)
```

- Todo import entre diretórios de `tests/` passou a usar o alias `@tests/*`; relativo só entre irmãos.
- `yarn test` = project `unit`. Novos: `yarn test:e2e`, `yarn test:all` (tudo em série).
- Cada tipo é invocado por `--selectProjects`: `maxWorkers` não é aceito dentro de `projects`, e a
  integração precisa ser serial — daí o `--runInBand` nos scripts.
- Coverage ficou na raiz da config (o Jest ignora essas opções dentro de um project) e deixou de ser
  automático: vem por `--coverage`, como o CI já fazia.
- CI: job `test` renomeado para "Unit tests", job `e2e` já escrito e **comentado** no `ci.yml` — quando
  o primeiro spec entrar, descomentar e incluir `e2e` no `needs` do job `docker`.
- Verde: 67 unit + 95 integration = 162 casos; `yarn test:e2e` passa com 0. `tsc --noEmit` e `lint` limpos.

### CHECKLIST.md auditado contra o código (2026-08-23)

`yarn test:integration` = **95 casos, 6 suítes, todos verdes** (verificado rodando
`test:integration:local`); `yarn test` 67/67; `yarn lint` limpo. Dos 14 achados que
falhavam de propósito, 11 já estão corrigidos no código: autorização por dono em
`DeleteProjectService`/`DeleteTagService`, defaults de paginação em `ProjectsController.list`,
`findAndCount()` no `ProjectsRepository.list`, statusCodes 404/403 no `UpdateProjectService`,
duplicidade de nome no `UpdateTagService`, `.email()` no `ICreateUserSchema` e
`deleteByToken` no `ResetPasswordservice`.

Os 3 achados restantes viraram testes **comentados** com o `// BUG:` acima (access token sem
`jti`, sessão fora do Redis, desvínculo de tag no `PUT /projects/:id`) — descomentar depois
de corrigir. A Etapa 1 fechou: todos os services listados leem `requestContext.getStore()`;
só `ResetPasswordservice.ts:52-56` ainda loga sem `requestId`.

CHECKLIST.md reescrito: Etapa 1 item 3 marcado, Etapa 7 dividida em "Achados corrigidos"
e "Achados ainda abertos", tabela de prioridade atualizada.

### Nomes padronizados: banco snake_case, código e HTTP camelCase (2026-08-22)

`created_at`/`updated_at`/`user_id`/`tag_id`/`avatar_url`/`old_password`/
`password_confirmation`/`InitializationVector` viraram `createdAt`/`updatedAt`/`userId`/
`tagId`/`avatarUrl`/`oldPassword`/`passwordConfirmation`/`initializationVector` em 68
arquivos de `src` e `tests`, incluindo os schemas yup, os 3 mappers, os DTOs e o
`swagger.json` — o contrato HTTP mudou junto (breaking change assumido).

As 4 entidades passaram a declarar o nome físico no decorator
(`@Column({ name: 'user_id' })`, `@CreateDateColumn({ name: 'created_at' })`), sem
`SnakeNamingStrategy`. `Tag` ganhou o `updatedAt` que já existia como coluna e perdeu o
`@JoinColumn` no-op sobre o `@OneToMany`. `CreateSessionsService` passou a usar
`UserMapper.toDTO` em vez de montar o `user` à mão.

A migration `1787368703953-RenameProjectColumnsToSnakeCase` renomeia
`projects.variablesEnvironment` → `variables_environment` e
`projects.InitializationVector` → `initialization_vector` (up e down validados nos dois
sentidos no banco de teste). O `cd.yml` passou a rodar as migrations **antes** do
`up -d`, num container efêmero da imagem nova, e a reverter a última migration no path
de rollback. Os scripts `migration:revert`/`migration:generate` foram corrigidos para
usar `ts-node` como os outros dois.

No caminho, um achado: o `npx typeorm migration:run` do `cd.yml` **nunca funcionou** — a
imagem levava `ormconfig.ts` para a raiz e não tem `ts-node`, então o CLI morria com
`SyntaxError`. O Dockerfile passou a copiar `build/ormconfig.js`, validado construindo a
imagem e rodando o CLI dentro dela contra o Postgres de teste.

Estado: `yarn test` 67/67 verde, `yarn lint`/`format:check`/`build-local` limpos,
`yarn test:integration` 95/98 — as 3 falhas são achados de bug já conhecidos
(desvínculo de tag no `PUT /projects/:id`, sessão fora do Redis, access token sem `jti`).


### Suíte red dissolvida na suíte de integração única (2026-08-20)

Os 12 casos que viviam em `*.red.spec.ts` foram movidos para o `describe` da rota que
exercitam, dentro dos specs de integração normais, e os 3 testes do bloco
"Comportamento atual documentado" de `auth.flow.spec.ts` foram convertidos para afirmar
o comportamento desejado. Suíte red, `jest.config.integration.red.ts`, os scripts
`test:integration:red*` e o step informativo do CI deixaram de existir.

`yarn test:integration`: **100 casos, 14 falhando de propósito** (6 em projects, 2 em
tags, 4 em auth, 2 em password). Cada um tem `// BUG: arquivo:linha` acima do `it`, e a
mensagem `Expected`/`Received` aparece no output — é o backlog de correção executável.

Decisão: o job `integration` do CI **reprova** enquanto houver bug, e o job `docker`
(`needs: [lint, test, integration, build]`) não publica imagem no GHCR nesse período.
Código com bug conhecido não vira artefato.

Verificado: 14 falhas e nenhuma colateral (86 passando), unitários 66/66, `yarn lint` e
`yarn format:check` limpos, `tsc --noEmit` limpo.


### Testes de integração — CRUD completo, suítes verde e red (2026-08-20)

CHECKLIST.md Etapa 7. `yarn test:integration` = **91 casos verdes** (6 suítes);
`yarn test:integration:red` = **12 casos que falham de propósito**, descrevendo o
comportamento desejado de bugs conhecidos. O usuário corrige o código olhando os red.

- Verde: `tests/integration/tags/tags.crud.spec.ts` (18), `projects/projects.crud.spec.ts` (28),
  `users/profile.crud.spec.ts` (13), `users/avatar.spec.ts` (5), `users/password.spec.ts` (7),
  além dos 20 de `auth/auth.flow.spec.ts` que já existiam
- Red: `projects/projects.bugs.red.spec.ts` (6), `tags/tags.bugs.red.spec.ts` (2),
  `users/users.bugs.red.spec.ts` (4) — cada caso tem comentário `// BUG: arquivo:linha`
- `jest.config.integration.red.ts` — config standalone (NÃO importa a config de integração:
  o Jest carrega o arquivo via ESM e o import relativo entre configs falha com ERR_MODULE_NOT_FOUND);
  `jest.config.integration.ts` passou a ignorar `\.red\.spec\.ts$`
- Scripts novos: `test:integration:red`, `test:integration:red:local`
- Helpers: `helpers/resources.ts` (factories de project/tag, `rawProject` para inspecionar
  a cifra no banco, `otherUserAgent`, `missingUuid`), `helpers/files.ts` (PNG 1x1 em memória,
  limpeza pontual de `<root>/uploads`), `helpers/mail.ts` (`FakeEmailProvider` instalado por
  `container.registerInstance('EmailProvider', ...)` — `NODE_ENV=test` cairia no SMTP real)

Verificado: integração 91/91, red 12/12 falhando, `yarn lint` limpo.


### Testes de integração — infraestrutura + fluxo de auth (2026-08-20)

CHECKLIST.md Etapa 6 fechada. 20 casos verdes em `tests/integration/auth/auth.flow.spec.ts`
rodando contra Postgres e Redis reais.

- `docker-compose.test.yml` — projeto compose `nimbus-test`, Postgres 17 na 5433 e Redis 7 na 6380, dados em `tmpfs`, `healthcheck` nos dois
- `.env.test` — versionado, sem segredo real (`NODE_ENV=test`, `CRYPTO_SECRET_KEY` com 64 chars hex, `STORAGE_DISK=local`)
- `jest.config.integration.ts` — `maxWorkers: 1`, `testTimeout: 30000`, coverage off, os 6 aliases do tsconfig, e o mapeamento de `@shared/infra/typeorm` para um stub
- `tests/integration/setup/` — `env.ts` (dotenv antes dos imports), `ormconfig.ts` (entidades e migrations como classes, não glob), `hooks.ts` (conexão + migrations + `TRUNCATE`/`FLUSHDB` por teste), `database.ts`, `typeormStub.ts`
- `tests/integration/helpers/auth.ts` — `authenticatedAgent()`, `findUserTokens()`, `findCachedSession()`, `getSetCookie()`
- `jest.config.ts` — `testPathIgnorePatterns` para `/build/` e `/tests/integration/`
- `.github/workflows/ci.yml` — job `integration` com `services: postgres/redis`; `docker` agora exige `[lint, test, integration, build]`
- `package.json` — `test:integration`, `test:integration:up|down|local`

Verificado: integração 20/20 em duas execuções seguidas; unitária 66/66 (21 suítes) sem
Docker; `yarn lint`, `yarn format:check` e `yarn build-local` limpos.

---

## 🚀 Next phase

**Goal:** fechar os 3 achados de auth/projects que sobraram (testes já escritos e comentados nos specs) e emendar na Etapa 3 do CHECKLIST — graceful shutdown.

### Acceptance criteria
1. `isAuthenticated` recusando access token assinado sem `jti` — descomentar `auth.flow.spec.ts:262-271`
2. Sessão ausente do Redis derrubando o token: `LogoutService` tem que apagar a linha de
   `user_tokens` mesmo com o cache já expirado, senão a linha órfã continua autenticando —
   descomentar `auth.flow.spec.ts:253-258`
3. Decidir o desvínculo de tag no `PUT /projects/:id` — hoje `UpdateProjectService.ts:50-67`
   mantém a tag atual quando `tagId` é omitido (`projects.crud.spec.ts:367-374`)
4. `yarn test:integration` de volta a 98 casos verdes com os três descomentados

Também abertos, sem teste (lista completa no CHECKLIST.md, "Achados ainda abertos"):
`GET /files/:filename` inexistente pendura a request (`app.ts:43-62` — tratar o evento `error`
do stream), enumeração de contas no `POST /password/forgot`, `POST /users` sem `id` na resposta,
nome do cookie hardcoded no `isAuthenticated`, `/metrics` sem autenticação.

### Closed decisions
- Uma suíte de integração só: casos de bug dentro do `describe` da rota, `it()` normal, sem `it.failing`/`skip`
- Comentário `// BUG: arquivo:linha — o que deveria acontecer` acima de cada caso
- CI reprova de propósito enquanto houver achado aberto; sem `continue-on-error`
- Testes falam só HTTP; banco direto apenas para inspecionar cifra/IV e envelhecer `created_at` de token
- `EmailProvider` substituído por fake no container, sem mexer em `NODE_ENV`

### Open decisions
- Desvincular tag no update é comportamento desejado ou o `PUT` deve continuar preservando a tag?
- Aplicar a migration de rename no banco de dev local (`yarn migration:run`) — o código já espera `variables_environment`/`initialization_vector`.

## 📁 Active architecture

- **Stack:** Node + TypeScript, Express 4, TypeORM 0.2 (API legada `getRepository`/`getConnection`), PostgreSQL 17, Redis 7 (ioredis), tsyringe, yup, Jest 30 + ts-jest, supertest
- **Key tables:** `users`, `user_tokens`, `projects`, `tags`
- **Módulos:** `users`, `projects`, `tags`, `audit` (vazio)
- **Patterns:** DDD por módulo (`domain` / `infra` / `services` / `mappers` / `dtos`); services com um `execute()`; DI por token string em `src/shared/container/index.ts`; unitário com fakes em memória e construção via `new`; integração via supertest contra infra real
- **Nomes:** banco em snake_case, código e contrato HTTP em camelCase; o nome físico da coluna aparece só no decorator da entidade. Nomes de tabela (`user_tokens`) e de cookie (`access_token`, `refresh_token`) seguem snake_case de propósito.
- **Auth:** JWT em cookie httpOnly `access_token`, refresh em `refresh_token`, sessão rastreada por `jti` no Redis (`session:<userId>`) com fallback em `user_tokens`

---

## ⚠️ External blockers (don't block coding)

- Testes de integração exigem Docker local (`yarn test:integration:up`)
- `.env` local (não versionado) segue sendo a fonte para `yarn dev`

---

## 🔧 Useful commands

```bash
yarn test                      # project unit, sem Docker (~30 s; coverage só com --coverage)
yarn test:integration:up       # sobe postgres-test (5433) + redis-test (6380)
yarn test:integration          # project integration (serial)
yarn test:integration:down     # derruba a infra e apaga os volumes
yarn test:integration:local    # up + test + down
yarn test:e2e                  # project e2e (hoje passa com 0 testes)
yarn test:all                  # todos os projects, em série
TEST_LOGS=true yarn test:integration   # não silencia o LogProvider
yarn lint && yarn format:check && yarn build-local
```

---

## 📚 References (read IF needed)

- `CHECKLIST.md` Etapa 6 — achados/bugs documentados pelos testes de integração
- `.wolf/cerebrum.md` — User Preferences + Do-Not-Repeat + Decision Log
- `.wolf/anatomy.md` — token-efficient file index
- `.wolf/buglog.json` — known bugs + fixes
