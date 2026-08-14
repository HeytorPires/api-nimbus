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

- [ ] Paralelizar `lint` e `test` em `ci.yml` (hoje `test` tem `needs: lint` sem depender de nada que o lint gere — roda em série sem motivo)
- [ ] Cache de `node_modules` via `actions/cache` com chave por `yarn.lock` (hoje `cache: yarn` só cacheia download, cada job reinstala do zero)
- [ ] Mover build da imagem Docker pro CI/registry (GHCR/Docker Hub) — hoje `cd.yml` builda a imagem **na VPS de produção** (`docker compose --profile production up -d --build`), competindo recurso com o app rodando e arriscando deploy travado no meio se o build quebrar. CD deveria só `pull` + `up`, sem `--build`
- [ ] `timeout-minutes` em cada job (hoje sem limite, trava até 6h em caso de hang)
- [ ] Corrigir `|| true` no passo de migration em `cd.yml` — hoje engole qualquer erro de migration junto com o caso legítimo de "nenhuma pendente"
- [ ] Rollback automático se o `up --build` falhar (hoje não há reversão pro container anterior)

---

## Etapa 1 — Correlação de requestId

> **Objetivo:** o log já é estruturado, mas `requestId` fica vazio na prática. `ErrorHandler.ts:33` gera um `errorId` isolado só no erro 500 — chamadas normais (`LogoutService.ts:25`, `SendForgotPasswordEmailService.ts:41/48/80`, `UpdateProfileService.ts:67`, `UpdateTagService.ts:37`, `UpdateProjectService.ts:77`, etc.) não passam `requestId`, e `CreateSessionsService.ts:82-86` manda `requestIp: 'N/A'` fixo.
> **Custo:** Baixo, sem dependência nova (`crypto.randomUUID()` é nativo) · **Valor agregado:** ⭐⭐⭐⭐⭐

- [ ] Middleware gerando UUID por requisição, capturando IP real
- [ ] Propagar via `AsyncLocalStorage` (contexto por request, sem precisar passar parâmetro em toda cadeia de chamada)
- [ ] Atualizar todos os pontos de log listados acima pra herdar o `requestId` do contexto
- [ ] Unificar `errorId` do `ErrorHandler.ts` com o `requestId` de correlação (hoje são conceitos duplicados)

---

## Etapa 2 — Health check e métricas

> **Objetivo:** hoje não existe nenhum endpoint de saúde nem métrica exposta (confirmado: grep vazio por `/health`, `/ready`, `prom-client`).
> **Custo:** Baixo · **Valor agregado:** ⭐⭐⭐⭐

- [x] Endpoint `/health` (liveness — processo vivo)
- [x] Endpoint `/ready` (readiness — checa conexão com Postgres/Redis)
- [x] `prom-client` expondo latência (p50/p95/p99) e taxa de erro por rota
- [x] Serviço Grafana/Prometheus adicionado ao `docker-compose.yml` já existente

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

- [ ] `supertest` batendo endpoint real contra banco de teste (testcontainers)
- [ ] Cobrir fluxo de autenticação completo (login → refresh → logout) ponta a ponta
- [ ] Rodar esses testes no CI que já existe (`ci.yml`)

---

## Ordem Recomendada de Implementação

| Prioridade                   | Itens                                       |
| ---------------------------- | ------------------------------------------- |
| **Agora**                    | Correlação de requestId, Graceful shutdown  |
| **Depois**                   | Health check, Métricas, Teste de integração |
| **Quando tiver caso de uso** | Mensageria                                  |
| **Quando tiver mensageria**  | Tracing distribuído                         |
