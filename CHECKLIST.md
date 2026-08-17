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

- [ ] Middleware gerando UUID por requisição, capturando IP real
- [ ] Propagar via `AsyncLocalStorage` (contexto por request, sem precisar passar parâmetro em toda cadeia de chamada)
- [ ] Atualizar todos os pontos de log listados acima pra herdar o `requestId` do contexto
- [~] Unificar `errorId` do `ErrorHandler.ts` com o `requestId` de correlação — nomenclatura já unificada (`errorId` virou `requestId`, usado nos dois ramos: `AppError` e 500). Falta a correlação real: o UUID ainda é gerado dentro do próprio handler, não herdado de um middleware/contexto de request

---

## Etapa 2 — Health check e métricas

> **Objetivo:** hoje não existe nenhum endpoint de saúde nem métrica exposta (confirmado: grep vazio por `/health`, `/ready`, `prom-client`).
> **Custo:** Baixo · **Valor agregado:** ⭐⭐⭐⭐

- [x] Endpoint `/health` (liveness — processo vivo) — `healthcheck.ts:26` (`status` + `uptime`), montado em `app.ts:35`
- [x] Endpoint `/ready` (readiness — checa conexão com Postgres/Redis) — `healthcheck.ts:30`, `SELECT 1` no Postgres + `PING` no Redis em paralelo, 200/503
- [x] `prom-client` expondo latência (p50/p95/p99) e taxa de erro por rota — `metrics.ts`: histograma `http_request_duration_seconds` com labels `method`/`route`/`status_code` + `collectDefaultMetrics()`, exposto em `/metrics`
- [x] Serviço Grafana/Prometheus adicionado ao `docker-compose.yml` já existente — mais `docker/prometheus/prometheus.yml` (scrape 15s no target `node:3333`) e vars `PROMETHEUS_PORT`/`GRAFANA_PORT`/`GRAFANA_ADMIN_PASSWORD` no `.env.example`

> **Pendência dessa etapa:** dashboard do Grafana ainda não provisionado (sobe vazio, precisa configurar datasource/painel na mão). `/metrics` está exposto sem autenticação.

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

- [~] `supertest` batendo endpoint real contra banco de teste (testcontainers) — `supertest` + `@types/supertest` instalados e `tests/shared/http/health.spec.ts` já bate no `app` via HTTP. Mas Postgres e Redis estão **mockados** (`jest.mock('typeorm')`, `jest.mock(RedisCache)`), então ainda não há banco de teste real / testcontainers
- [ ] Cobrir fluxo de autenticação completo (login → refresh → logout) ponta a ponta
- [x] Rodar esses testes no CI que já existe (`ci.yml`) — job `test` roda `yarn test`, que já pega `tests/shared/**`

---

## Ordem Recomendada de Implementação

| Prioridade                   | Itens                                       |
| ---------------------------- | ------------------------------------------- |
| **Agora**                    | Correlação de requestId, Graceful shutdown  |
| **Depois**                   | Health check, Métricas, Teste de integração |
| **Quando tiver caso de uso** | Mensageria                                  |
| **Quando tiver mensageria**  | Tracing distribuído                         |
