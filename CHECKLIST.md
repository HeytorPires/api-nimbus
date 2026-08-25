# 🚀 Checklist de Profissionalização — Backend

Este checklist complementa o `ROADMAP.md` (foco em segurança). Cada item foi checado no código antes de entrar aqui — nada de suposição genérica.

---

## Já resolvido (não é pendência)

- ✅ **CI/CD existe e funciona** — `.github/workflows/ci.yml` (lint → test com coverage → build) e `cd.yml` (deploy via SSH em VPS, migration automática). Só não está otimizado (ver Etapa 0 abaixo).
- ✅ **Log estruturado** — `LogProvider.ts` já emite JSON (`timestamp`, `level`, `message`, `context`, `requestId`, `requestIp`, `metadata`).
- ✅ **docker-compose** já sobe `node`, `postgres`, `redis`, `minio` — infra pronta pra plugar observabilidade local sem custo extra.

---

## Etapa 0 — Otimizar CI/CD existente

> **Objetivo:** pipeline funciona, mas tem gordura e um ponto de risco real em produção.
> **Custo:** Baixo · **Valor agregado:** ⭐⭐⭐⭐⭐

- [x] Paralelizar `lint` e `test` em `ci.yml` — `needs:` removido de `test` e de `build`; os três jobs agora rodam em paralelo
- [x] Cache de `node_modules` via `actions/cache` com chave por `yarn.lock` — extraído para a composite action `.github/actions/setup-node-deps`, usada pelos três jobs; install só roda em cache miss
- [x] Mover build da imagem Docker pro CI/registry — job `docker` em `ci.yml` publica no GHCR (`ghcr.io/heytorpires/api-nimbus:<sha>` e `:latest`) em runner ARM nativo (`ubuntu-24.04-arm`, a VPS Oracle é `aarch64`); `docker-compose.yml` passou a declarar `image:` com `${IMAGE_TAG:-latest}` e o `cd.yml` faz `pull` + `up`, sem `--build`
- [x] `timeout-minutes` em cada job — `lint: 10`, `test: 15`, `build: 30`
- [x] Corrigir `|| true` no passo de migration em `cd.yml` — removido; migration que falha agora quebra o deploy
- [x] Rollback automático se o deploy falhar (hoje não há reversão pro container anterior) — `cd.yml`: healthcheck em `/ready` pós-deploy (10 tentativas/3s), falhou → volta pra `PREVIOUS_TAG` gravada em `.last_deploy_tag` do deploy anterior bem-sucedido, job falha (`exit 1`) se rollback também não subir saudável. Não cobre migration destrutiva — ver nota abaixo

> **Nota:** o rollback acima só reverte o container/imagem, não o schema do banco. Migrations devem seguir o padrão expand/contract (só aditivas: nova coluna nullable, nunca `RENAME`/`DROP` na mesma migration que introduz o uso) pra rollback de container continuar funcionando mesmo depois de uma migration nova. Reverter migration em produção automaticamente não é recomendado — fica manual (`yarn migration:revert`) caso necessário.

---

## Etapa 1 — Correlação de requestId

> **Objetivo:** o log já é estruturado, mas `requestId` fica vazio na prática. `ErrorHandler.ts:33` gera um `errorId` isolado só no erro 500 — chamadas normais (`LogoutService.ts:25`, `SendForgotPasswordEmailService.ts:41/48/80`, `UpdateProfileService.ts:67`, `UpdateTagService.ts:37`, `UpdateProjectService.ts:77`, etc.) não passam `requestId`, e `CreateSessionsService.ts:82-86` manda `requestIp: 'N/A'` fixo.
> **Custo:** Baixo, sem dependência nova (`crypto.randomUUID()` é nativo) · **Valor agregado:** ⭐⭐⭐⭐⭐

- [x] Middleware gerando UUID por requisição, capturando IP real — `requestContext.ts` gera `randomUUID()`, seta `request.id`; `app.ts` liga `app.set('trust proxy', 1)` (há proxy reverso na VPS) antes do middleware, então `request.ip` resolve o `X-Forwarded-For` corretamente
- [x] Propagar via `AsyncLocalStorage` — `src/config/context.ts` (`requestContext: AsyncLocalStorage<IRequestContext>`), `requestContextMiddleware` envolve `next()` inteiro em `requestContext.run(...)`, disponível em qualquer ponto da cadeia async da requisição
- [x] Atualizar todos os pontos de log listados acima pra herdar o `requestId` do contexto — `LogoutService`, `CreateSessionsService` (`requestIp` fixo eliminado), `SendForgotPasswordEmailService`, `UpdateProfileService`, `UpdateTagService` e `UpdateProjectService` leem `requestContext.getStore()` dentro do `execute()` com `?.` (nunca guardando o store em propriedade de instância no construtor). Sobra só `ResetPasswordservice.ts:52-56`, que ainda loga sem `requestId`/`requestIp`
- [x] Unificar `errorId` do `ErrorHandler.ts` com o `requestId` de correlação — `ErrorHandler.ts` agora lê `requestContext.getStore()` (com `?.`, sem crash se vazio) em vez de gerar `randomUUID()` isolado; `requestId` correlacionado aparece no log e na resposta JSON de erro (400 e 500)

---

## Etapa 2 — Health check e métricas

> **Objetivo:** hoje não existe nenhum endpoint de saúde nem métrica exposta (confirmado: grep vazio por `/health`, `/ready`, `prom-client`).
> **Custo:** Baixo · **Valor agregado:** ⭐⭐⭐⭐

- [x] Endpoint `/health` (liveness — processo vivo) — `healthcheck.ts:26` (`status` + `uptime`), montado em `app.ts:35`
- [x] Endpoint `/ready` (readiness — checa conexão com Postgres/Redis) — `healthcheck.ts:30`, `SELECT 1` no Postgres + `PING` no Redis em paralelo, 200/503
- [x] `prom-client` expondo latência (p50/p95/p99) e taxa de erro por rota — `metrics.ts`: histograma `http_request_duration_seconds` com labels `method`/`route`/`status_code` + `collectDefaultMetrics()`, exposto em `/metrics`
- [x] Serviço Grafana/Prometheus adicionado ao `docker-compose.yml` já existente — mais `docker/prometheus/prometheus.yml` (scrape 15s no target `node:3333`) e vars `PROMETHEUS_PORT`/`GRAFANA_PORT`/`GRAFANA_ADMIN_PASSWORD` no `.env.example`

> **Pendência dessa etapa:** dashboard do Grafana ainda não provisionado (sobe vazio, precisa configurar datasource/painel na mão).

- [ ] Autenticação na rota `/metrics` — hoje exposta sem nenhuma proteção (`app.ts`: `app.get('/metrics', metricsHandler)` sem middleware). Opções: Basic Auth simples (usuário/senha via env, ex. `METRICS_USER`/`METRICS_PASSWORD`) só nessa rota, ou restringir por IP/rede interna (bloquear no proxy reverso, já que a VPS tem um na frente). Prometheus já suporta Basic Auth no `scrape_config` (`docker/prometheus/prometheus.yml`), então essa opção não exige mudança na config de scrape além de credenciais

---

## Etapa 3 — Graceful shutdown e resiliência

> **Objetivo:** `server.ts` hoje é só `app.listen`, sem handler de `SIGTERM`/`SIGINT`. Há chamada externa real (`NodeMailerProvider.ts`, `MinioStorageProvider.ts`) sem nenhum retry/timeout — falha externa propaga direto.
> **Custo:** Baixo/Médio · **Valor agregado:** ⭐⭐⭐⭐

- [ ] Handler de `SIGTERM`/`SIGINT` drenando conexões (DB, Redis) antes de matar o processo
- [ ] Timeout explícito em chamada de email/storage
- [ ] Retry com backoff no envio de email (falha transitória de SMTP é comum)
- [ ] Circuit breaker se storage externo (Minio/S3) ficar instável

---

## Etapa 4 — Mensageria

> **Objetivo:** processar tarefa pesada fora do ciclo de request/response. Hoje inexistente (confirmado: nenhuma lib de fila no `package.json`).
> **Custo:** Médio · **Valor agregado:** ⭐⭐⭐⭐

- [ ] Escolher broker (RabbitMQ ou SQS+localstack)
- [ ] Extrair um caso de uso real pra evento assíncrono (ex: upload de arquivo → worker processa e notifica)
- [ ] Worker consumidor separado do processo HTTP principal
- [ ] Dead-letter queue para mensagem que falha repetidamente
- [ ] Idempotência: evento duplicado não duplica efeito

---

## Etapa 5 — Tracing distribuído

> **Objetivo:** só faz sentido depois de ter mensageria (seguir requisição HTTP → fila → worker). Hoje inexistente.
> **Custo:** Médio · **Valor agregado:** ⭐⭐⭐

- [ ] Instrumentar com OpenTelemetry
- [ ] Propagar contexto de trace do HTTP pro evento de fila
- [ ] Exportar para Jaeger/Tempo local via docker-compose

---

## Etapa 6 — Testes de integração

> **Objetivo:** hoje só há unit test com fakes (87% cobertura nos services, mas nenhum teste bate no banco/HTTP real).
> **Custo:** Médio · **Valor agregado:** ⭐⭐⭐⭐

- [x] `supertest` batendo endpoint real contra banco de teste — optamos por `docker-compose.test.yml` (Postgres 17 + Redis 7 em portas 5433/6380, dados em `tmpfs`) em vez de testcontainers, para não adicionar dependência nem tempo de startup. Config própria em `jest.config.integration.ts`; `.env.test` versionado; `tests/integration/setup/hooks.ts` abre a conexão, aplica as migrations e faz `TRUNCATE` + `FLUSHDB` entre testes
- [x] Cobrir fluxo de autenticação completo (login → refresh → logout) ponta a ponta — `tests/integration/auth/auth.flow.spec.ts`, 18 casos: cadastro, login (cookies `HttpOnly`/`SameSite`, `jti` no Redis e em `user_tokens`), rota autenticada, rotação de `jti` no refresh, logout e invalidação
- [x] Rodar esses testes no CI que já existe (`ci.yml`) — job `test` (unitário, sem infra) e novo job `integration` com `services: postgres/redis`; `docker` agora depende dos dois

### Achados desta etapa

Os 7 achados levantados aqui foram consolidados na lista da Etapa 7 — hoje divididos
entre "Achados corrigidos" e "Achados ainda abertos".

---

## Etapa 7 — Testes de integração do CRUD completo

> **Objetivo:** cobrir ponta a ponta todo o resto da API além do auth: `projects` (com criptografia), `tags`, perfil, upload de avatar e reset de senha.
> **Custo:** Médio · **Valor agregado:** ⭐⭐⭐⭐

- [x] Suíte única `yarn test:integration` — **95 casos, todos verdes**, 6 arquivos:
  - `tests/integration/auth/auth.flow.spec.ts` (18) — cadastro, login, profile, refresh, logout e invalidação de sessão
  - `tests/integration/tags/tags.crud.spec.ts` (20) — CRUD, unicidade de nome por usuário (create e update), paginação com defaults, isolamento entre contas
  - `tests/integration/projects/projects.crud.spec.ts` (31) — CRUD, cifra AES persistida (ciphertext + IV de 16 bytes no banco), round-trip do decrypt, vínculo e validação de `tagId`, paginação/ordenação/`totalRows`, autorização por dono, cascade ao apagar a tag
  - `tests/integration/users/profile.crud.spec.ts` (13) — `GET /users/me`, `GET/PUT /profile`, troca de senha revalidada por novo login
  - `tests/integration/users/avatar.spec.ts` (5) — upload multipart, `avatarUrl` do `LocalStorageProvider`, `GET /files/:filename`, remoção do avatar anterior
  - `tests/integration/users/password.spec.ts` (8) — forgot/reset com `EmailProvider` fake, token expirado envelhecido no banco, token de uso único
- [x] Helpers reutilizáveis em `tests/support/helpers/`: `auth.ts` (`authenticatedAgent`, `otherUserAgent`, inspeção de token/sessão), `http.ts` (`anonymous`, `missingUuid`), `projects.ts`/`tags.ts` (factories, `rawProject`), `files.ts` (PNG em memória, limpeza de uploads), `mail.ts` (`FakeEmailProvider` via `container.registerInstance`)

### Achados corrigidos (11 de 14)

A leva de 14 casos que falhavam de propósito virou correção de código — a suíte fechou verde,
então o job `integration` do CI passa e o `docker` volta a publicar imagem no GHCR.

**`projects`**

- [x] `DELETE /projects/:id` checa dono — `DeleteProjectService.execute(id, userId)` responde 404 (inexistente) / 403 (alheio) e `ProjectsController.delete` passa o `userId`
- [x] `GET /projects` sem query params usa `Number(perPage) || 10` / `Number(currentPage) || 1` (`ProjectsController.list`), sem `NaN`
- [x] `totalRows` passou a ser o total do usuário (`ProjectsRepository.list` com `findAndCount()`)
- [x] `UpdateProjectService` lança "Project not found." com 404 e "Access denied." com 403; tag de outro dono responde 403 e tag inexistente 404

**`tags`**

- [x] `DELETE /tags/:id` checa dono (`DeleteTagService` 404/403, `TagsController.delete` passa o `userId`)
- [x] `PUT /tags/:id` revalida duplicidade: `findByName(name, userId)` com nome já usado por outra tag responde 400 "Tag name already in use."

**`auth` / `password`**

- [x] `ICreateUserSchema.ts` valida formato de e-mail (`yup.string().email()`)
- [x] `ResetPasswordservice.ts` invalida o `user_token` usado (`deleteByToken(token)`) — link de reset é de uso único

### Achados ainda abertos

Os três primeiros têm teste escrito e **comentado** no spec, com o `// BUG:` acima — basta
descomentar depois da correção. Os demais nunca tiveram teste.

- [ ] Access token assinado **sem `jti`** passa direto: `isAuthenticated` só consulta Redis/banco quando o `jti` existe (`auth.flow.spec.ts:260-271`)
- [ ] Sessão apagada do Redis continua autenticando pelo fallback de banco: `LogoutService` não remove a linha de `user_tokens` quando o cache já expirou, e a linha órfã segue válida (`auth.flow.spec.ts:251-258`)
- [ ] `PUT /projects/:id` sem `tagId` mantém a tag atual — não existe forma de desvincular (`UpdateProjectService.ts:50-67`); decisão de produto pendente (`projects.crud.spec.ts:367-374`)
- [ ] `POST /password/forgot` com e-mail inexistente responde 404 "User does not exists." (`SendForgotPasswordEmailService.ts:31-37`) — enumeração de contas; deveria ser 204 sempre
- [ ] `POST /users` responde sem o `id`: a coluna tem `default uuid_generate_v4()`, mas a entidade `User` declara `@PrimaryColumn()` sem `@Generated('uuid')`, então o TypeORM não faz `RETURNING` e o DTO sai com `id: undefined`
- [ ] `isAuthenticated` lê `request.cookies?.access_token` hardcoded (`isAuthenticated.ts:20`), ignorando `authConfig.cookie.accessToken.name` / `ACCESS_TOKEN_COOKIE_NAME` — se a variável for definida, login e middleware divergem
- [ ] `SessionsController.refresh` devolve `accessToken` no corpo (`SessionsController.ts:52`), assimétrico com o `create`, que só usa cookies
- [ ] `src/shared/infra/http/routes/index.ts` é duplicata morta de `index.routes.ts`
- [ ] `src/shared/infra/typeorm/index.ts` dispara `createConnection` como side effect, sem `await` nem export — obrigou o stub via `moduleNameMapper`
- [ ] `GET /files/:filename` com arquivo inexistente **pendura a request**: `app.ts:43-62` chama `getFileStream` dentro do `try`, mas o `ENOENT` vem no evento `error` do stream, fora dele — o 404 nunca é enviado. Sem teste porque travaria a suíte por timeout de 30s

### Fora do escopo desta leva

- Cobertura de `/api-docs`, `/health`, `/ready`, `/metrics`
- Teste do rate limiter (100 pontos/s por IP — exigiria manipular o contador do Redis)

---

## Ordem Recomendada de Implementação

| Prioridade                   | Itens                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Agora**                    | Graceful shutdown (Etapa 3), auth no `/metrics`, achados abertos de auth (`jti`, sessão órfã)                          |
| **Depois**                   | Timeout/retry em email e storage, dashboard do Grafana, limpeza (`routes/index.ts`, side effect do `typeorm/index.ts`) |
| **Quando tiver caso de uso** | Mensageria                                                                                                             |
| **Quando tiver mensageria**  | Tracing distribuído                                                                                                    |

**Concluído:** Etapa 0 (CI/CD), Etapa 1 (correlação de `requestId`), Etapa 2 exceto auth no
`/metrics` e dashboard, Etapas 6 e 7 (integração, 95 casos verdes).
