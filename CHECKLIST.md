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
- [~] Atualizar todos os pontos de log listados acima pra herdar o `requestId` do contexto — `LogoutService.ts` migrado e corrigido: lê `requestContext.getStore()` dentro do `execute()` com `?.` (não guarda em propriedade de instância no construtor), 3 testes de `LogoutService.spec.ts` passando. Pendente: `SendForgotPasswordEmailService.ts`, `UpdateProfileService.ts`, `UpdateTagService.ts`, `UpdateProjectService.ts` e `CreateSessionsService.ts` (`requestIp: 'N/A'` fixo) ainda não migrados
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
- [x] Cobrir fluxo de autenticação completo (login → refresh → logout) ponta a ponta — `tests/integration/auth/auth.flow.spec.ts`, 20 casos: cadastro, login (cookies `HttpOnly`/`SameSite`, `jti` no Redis e em `user_tokens`), rota autenticada, rotação de `jti` no refresh, logout e invalidação
- [x] Rodar esses testes no CI que já existe (`ci.yml`) — job `test` (unitário, sem infra) e novo job `integration` com `services: postgres/redis`; `docker` agora depende dos dois

### Achados desta etapa

Os 7 achados levantados aqui foram consolidados na lista da Etapa 7 — os que têm
teste viraram casos falhando de propósito nos specs de integração, e os demais
estão em "Achados sem teste".

---

## Etapa 7 — Testes de integração do CRUD completo

> **Objetivo:** cobrir ponta a ponta todo o resto da API além do auth: `projects` (com criptografia), `tags`, perfil, upload de avatar e reset de senha.
> **Custo:** Médio · **Valor agregado:** ⭐⭐⭐⭐

- [x] Suíte única `yarn test:integration` — **100 casos**, 6 arquivos:
  - `tests/integration/auth/auth.flow.spec.ts` (22) — cadastro, login, profile, refresh, logout e invalidação de sessão
  - `tests/integration/tags/tags.crud.spec.ts` (20) — CRUD, unicidade de nome por usuário, paginação com defaults, isolamento entre contas
  - `tests/integration/projects/projects.crud.spec.ts` (32) — CRUD, cifra AES persistida (ciphertext + IV de 16 bytes no banco), round-trip do decrypt, vínculo e validação de `tag_id`, paginação e ordenação, cascade ao apagar a tag
  - `tests/integration/users/profile.crud.spec.ts` (13) — `GET /users/me`, `GET/PUT /profile`, troca de senha revalidada por novo login
  - `tests/integration/users/avatar.spec.ts` (5) — upload multipart, `avatar_url` do `LocalStorageProvider`, `GET /files/:filename`, remoção do avatar anterior
  - `tests/integration/users/password.spec.ts` (9) — forgot/reset com `EmailProvider` fake, token expirado envelhecido no banco
- [x] Helpers reutilizáveis: `tests/integration/helpers/resources.ts` (factories de project/tag, `rawProject`, `otherUserAgent`, `missingUuid`), `helpers/files.ts` (PNG em memória, limpeza de uploads), `helpers/mail.ts` (`FakeEmailProvider` via `container.registerInstance`)

### Achados: 14 casos falhando de propósito

Os testes afirmam o comportamento **desejado**, não o atual. Cada um tem um comentário
`// BUG: arquivo:linha` acima do `it`, e vive no `describe` da rota que exercita — rodar
`yarn test:integration` mostra o que falta, com `Expected`/`Received`.

Consequência aceita: o job `integration` do CI reprova, e o job `docker` (que declara
`needs: [lint, test, integration, build]`) não publica imagem no GHCR até a suíte ficar
verde. Código com bug conhecido não vira artefato.

**`projects.crud.spec.ts`**

- [ ] `DELETE /projects/:id` não checa dono: `DeleteProjectService.ts:12-20` só valida existência e `ProjectsController.ts:55-57` nem passa o `user_id` — qualquer autenticado apaga projeto alheio (esperado 403)
- [ ] `GET /projects` sem query params vira `NaN` em `take`/`skip` — `ProjectsController.ts:33-35` faz `Number(...)` sem default (o controller de tags tem `|| 10` / `|| 1`)
- [ ] `totalRows` é o tamanho da página, não o total do usuário — `ProjectsRepository.list` usa `find()` em vez de `findAndCount()`
- [ ] `UpdateProjectService.ts:40-43` lança "Project not found." sem `statusCode` (400; esperado 404)
- [ ] `UpdateProjectService.ts:45-48` lança "Access denied." sem `statusCode` (400; esperado 403, como no `ShowProjectService`)
- [ ] `PUT /projects/:id` sem `tag_id` mantém a tag atual — não existe forma de desvincular (`UpdateProjectService.ts:50-67`); é decisão de produto

**`tags.crud.spec.ts`**

- [ ] `DELETE /tags/:id` não checa dono (`DeleteTagService.ts:12-20`, `TagsController.ts:46-48`) — esperado 403
- [ ] `PUT /tags/:id` não revalida duplicidade de nome (`UpdateTagService.ts:23-48`) — dá para renomear uma tag para o nome de outra do mesmo usuário

**`auth.flow.spec.ts`**

- [ ] `POST /users` responde sem o `id`: a coluna tem `default uuid_generate_v4()`, mas a entidade `User` declara `@PrimaryColumn()` sem `@Generated('uuid')`
- [ ] `ICreateUserSchema.ts` não valida formato de e-mail (falta `.email()`, que o `IUpdateProfileSchema` já tem)
- [ ] Sessão apagada do Redis continua autenticando pelo fallback de banco: `LogoutService` não remove a linha de `user_tokens` quando o cache já expirou
- [ ] Access token assinado **sem `jti`** passa direto: `isAuthenticated` só consulta Redis/banco quando o `jti` existe

**`password.spec.ts`**

- [ ] `POST /password/forgot` com e-mail inexistente responde 400 "User does not exists." (`SendForgotPasswordEmailService.ts:32-35`) — enumeração de contas; deveria ser 204 sempre
- [ ] `ResetPasswordservice.ts` não invalida o `user_token` usado — o mesmo link de reset funciona até expirar por tempo

### Achados sem teste

- [ ] `isAuthenticated` lê `request.cookies?.access_token` hardcoded (`isAuthenticated.ts:20`), ignorando `authConfig.cookie.accessToken.name` / `ACCESS_TOKEN_COOKIE_NAME` — se a variável for definida, login e middleware divergem
- [ ] `SessionsController.refresh` devolve `accessToken` no corpo, assimétrico com o `create`, que só usa cookies
- [ ] `src/shared/infra/http/routes/index.ts` é duplicata morta de `index.routes.ts`
- [ ] `src/shared/infra/typeorm/index.ts` dispara `createConnection` como side effect, sem `await` nem export — obrigou o stub via `moduleNameMapper`
- [ ] `GET /files/:filename` com arquivo inexistente **pendura a request**: `app.ts:43-62` chama `fs.createReadStream` dentro do `try`, mas o `ENOENT` vem no evento `error` do stream, fora dele — o 404 nunca é enviado. Sem teste porque travaria a suíte por timeout de 30s

### Fora do escopo desta leva

- Cobertura de `/api-docs`, `/health`, `/ready`, `/metrics`
- Teste do rate limiter (100 pontos/s por IP — exigiria manipular o contador do Redis)

---

## Ordem Recomendada de Implementação

| Prioridade                   | Itens                                       |
| ---------------------------- | ------------------------------------------- |
| **Agora**                    | Correlação de requestId, Graceful shutdown  |
| **Depois**                   | Health check, Métricas, Teste de integração |
| **Quando tiver caso de uso** | Mensageria                                  |
| **Quando tiver mensageria**  | Tracing distribuído                         |
