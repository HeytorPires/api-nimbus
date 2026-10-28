# Api do Nimbus (api-nimbus) 🚀

API REST do Nimbus, um gerenciador de `.env`: cada projeto guarda as variáveis de ambiente de uma aplicação, cifradas em repouso. Construída em Node.js + TypeScript como projeto de estudo com arquitetura inspirada em **Domain-Driven Design**: Express + TypeORM + PostgreSQL, autenticação JWT em cookie `httpOnly`, sessões e cache em Redis, storage de arquivos local ou compatível com S3 (RustFS, via SDK da AWS), envio de e-mail via API do Resend ou SMTP (Nodemailer) e observabilidade com Prometheus/Grafana.

---

## 🎯 Objetivos de estudo (checklist)

- [x] Arquitetura modular no estilo **DDD** (`domain` / `infra` / `services` / `mappers` / `dtos`)
- [x] Injeção de dependência com **tsyringe** (repositórios e providers atrás de interfaces)
- [x] Autenticação com **JWT** em cookie `httpOnly` + fluxo de refresh token
- [x] Invalidação de sessão por `jti` no **Redis**, com fallback no banco
- [x] Criptografia de dados sensíveis em repouso (AES + IV por registro)
- [x] Validação de entrada por schema (**yup**) em middleware, por rota
- [x] Rate limiting, tratamento centralizado de erros e logs com `requestId`
- [x] Upload de avatar de usuário (storage local ou S3-compatível)
- [x] Recuperação de senha por e-mail
- [x] Health checks (`/health`, `/ready`) e métricas Prometheus (`/metrics`)
- [x] Documentação da API com **Swagger** (`/api-docs`)
- [x] Suíte de **testes automatizados**:
  - [x] Testes unitários (services com fakes em memória)
  - [x] Testes de integração (supertest contra Postgres e Redis reais)
  - [ ] Testes End-to-End (slot já configurado, sem specs ainda)
- [x] CI (lint, unit, integration, build, imagem Docker) e CD (deploy via SSH)
- 🔒 Próximos passos de segurança e infraestrutura: veja o [Roadmap de Segurança](#-roadmap-de-segurança)

---

## ✨ Funcionalidades implementadas

**Usuários e autenticação**

- Cadastro de usuário, consulta do próprio usuário (`/users/me`) e upload de avatar
- Login/logout com JWT em cookie `httpOnly` (`access_token`) e refresh token (`refresh_token`)
- Sessão rastreada por `jti` no Redis (`session:<userId>`), com fallback na tabela `user_tokens`
- Perfil: consulta e atualização (inclui troca de senha com confirmação)
- Recuperação de senha: solicitação por e-mail com token e reset

**Projetos**

- CRUD completo, escopado por dono (usuário só acessa os próprios projetos)
- Listagem paginada (`typeorm-pagination`)
- Variáveis de ambiente do projeto cifradas no banco (`variables_environment` + `initialization_vector`)
- Vínculo opcional com uma tag

**Tags**

- CRUD completo, escopado por dono, com checagem de nome duplicado

**Infraestrutura transversal**

- `/health` e `/ready` para liveness/readiness
- `/metrics` no formato Prometheus (`prom-client`)
- `/files/:filename` para servir arquivos do storage local
- `/api-docs` com a especificação Swagger

---

## 🌐 Endpoints

Todas as rotas abaixo são relativas à raiz da API. Rotas marcadas com 🔒 exigem o cookie `access_token`.

| Método   | Rota                | Descrição                                      |
| -------- | ------------------- | ---------------------------------------------- |
| `POST`   | `/users`            | Cria um usuário                                |
| `GET`    | `/users/me`         | 🔒 Retorna o usuário autenticado               |
| `PATCH`  | `/users/avatar`     | 🔒 Envia o avatar (`multipart/form-data`)      |
| `POST`   | `/sessions`         | Login — define os cookies de sessão            |
| `POST`   | `/sessions/refresh` | Renova o access token (com rate limit próprio) |
| `DELETE` | `/sessions`         | 🔒 Logout — invalida a sessão                  |
| `POST`   | `/password/forgot`  | Envia e-mail de recuperação de senha           |
| `PUT`    | `/password/reset`   | Redefine a senha a partir do token             |
| `GET`    | `/profile`          | 🔒 Consulta o perfil                           |
| `PUT`    | `/profile`          | 🔒 Atualiza o perfil (nome, e-mail, senha)     |
| `GET`    | `/projects`         | 🔒 Lista os projetos do usuário (paginado)     |
| `GET`    | `/projects/:id`     | 🔒 Detalha um projeto                          |
| `POST`   | `/projects`         | 🔒 Cria um projeto                             |
| `PUT`    | `/projects/:id`     | 🔒 Atualiza um projeto                         |
| `DELETE` | `/projects/:id`     | 🔒 Remove um projeto                           |
| `GET`    | `/tags`             | 🔒 Lista as tags do usuário                    |
| `GET`    | `/tags/:id`         | 🔒 Detalha uma tag                             |
| `POST`   | `/tags`             | 🔒 Cria uma tag                                |
| `PUT`    | `/tags/:id`         | 🔒 Atualiza uma tag                            |
| `DELETE` | `/tags/:id`         | 🔒 Remove uma tag                              |
| `GET`    | `/health`           | Liveness                                       |
| `GET`    | `/ready`            | Readiness (checa dependências)                 |
| `GET`    | `/metrics`          | Métricas no formato Prometheus                 |
| `GET`    | `/files/:filename`  | Serve um arquivo do storage local              |
| `GET`    | `/api-docs`         | Swagger UI                                     |

O contrato HTTP usa **camelCase** (`createdAt`, `userId`, `tagId`, `avatarUrl`, `oldPassword`); o banco usa **snake_case**. O nome físico da coluna aparece apenas no decorator da entidade.

---

## 🛠️ Tecnologias

| Camada              | Ferramentas                                                   |
| ------------------- | ------------------------------------------------------------- |
| Runtime / linguagem | Node.js 18+, TypeScript 5                                     |
| HTTP                | Express 4, cors, cookie-parser, `rate-limiter-flexible`       |
| Persistência        | TypeORM 0.2, PostgreSQL 17, `typeorm-pagination`              |
| Cache / sessão      | Redis 7 (ioredis)                                             |
| Autenticação        | `jsonwebtoken`, `bcryptjs`                                    |
| Validação           | yup (um schema por ação, aplicado por middleware)             |
| DI                  | tsyringe                                                      |
| E-mail              | Resend (API), SMTP via Nodemailer ou Ethereal, escolhidos por `MAIL_DRIVER` |
| Storage             | filesystem local ou RustFS (S3-compatível), multer no upload  |
| Observabilidade     | `prom-client`, Prometheus, Grafana                            |
| Documentação        | swagger-ui-express + `src/docs/swagger.json`                  |
| Testes              | Jest 30 + ts-jest, supertest                                  |
| Qualidade           | ESLint (zero warnings), Prettier                              |
| Infra               | Docker, Docker Compose, GitHub Actions (CI + CD), GHCR        |

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [Yarn](https://yarnpkg.com/) (preferencialmente) ou npm
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## ⚙️ Configuração e instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/HeytorPires/api-nimbus.git
   cd api-nimbus
   ```

2. **Instale as dependências:**

   ```bash
   yarn install
   ```

3. **Configure o ambiente:**

   ```bash
   cp .env.example .env
   ```

   Preencha o `.env`. O servidor **não sobe** se faltar variável obrigatória: `src/config/validateEnv.ts` roda no boot (antes do banco e do container) e imprime tudo que falta de uma vez, por exemplo `Missing environment variables: APP_SECRET, CRYPTO_SECRET_KEY`. Valem em qualquer ambiente `APP_SECRET`, `REFRESH_TOKEN_SECRET`, `CRYPTO_SECRET_KEY` (64 caracteres hex), `APP_API_URL` e `APP_WEB_URL`; em produção também `CORS_ORIGIN`, `DB_*` e `REDIS_HOST`; e o `MAIL_DRIVER` / `STORAGE_DISK` escolhido exige as suas chaves. As variáveis principais:

   | Variável                                                    | Para que serve                                              |
   | ----------------------------------------------------------- | ----------------------------------------------------------- |
   | `NODE_ENV`                                                  | `development` \| `production`                               |
   | `MAIL_DRIVER`                                               | `resend` \| `smtp` \| `ethereal` — sem ele, `development` usa Ethereal e o resto SMTP |
   | `API_PORT`                                                  | Porta da API (padrão `3333`)                                |
   | `APP_SECRET`                                                | Segredo de assinatura do JWT                                |
   | `CRYPTO_SECRET_KEY`                                         | Chave AES (64 caracteres hexadecimais) dos dados cifrados   |
   | `APP_API_URL`, `APP_WEB_URL`, `CORS_ORIGIN`                 | URLs da API, do front e origem liberada no CORS             |
   | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`   | Conexão com o PostgreSQL                                    |
   | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASS`                    | Conexão com o Redis                                         |
   | `RESEND_API_KEY`                                            | Chave da API do Resend (`MAIL_DRIVER=resend`)               |
   | `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`          | SMTP de envio de e-mail (`MAIL_DRIVER=smtp`)                |
   | `STORAGE_DISK`                                              | `local` \| `s3` — escolhe o provider de storage          |
   | `S3_*`                                                      | Endpoint, credenciais e bucket do storage S3 (RustFS)       |
   | `PROMETHEUS_PORT`, `GRAFANA_PORT`, `GRAFANA_ADMIN_PASSWORD` | Portas e senha da stack de observabilidade                  |

   Se você **não** for usar o Docker para o banco, aponte as variáveis para uma instância acessível manualmente.

4. **Suba os serviços de apoio:**

   ```bash
   yarn up          # docker-compose up: postgres, redis, rustfs, prometheus, grafana
   ```

   Aguarde os containers ficarem saudáveis (`docker compose logs -f`).

5. **Rode as migrations:**

   ```bash
   yarn migration:run
   ```

---

## ▶️ Executando a aplicação

**Desenvolvimento** (hot reload via `ts-node-dev`, debugger em `--inspect`):

```bash
yarn dev
```

A API responde em `http://localhost:$API_PORT` (por padrão `http://localhost:3333`), com o Swagger em `/api-docs`.

**Produção:**

```bash
yarn build     # tsc + tsc-alias + copia o .env para build/
yarn start     # node build/src/shared/infra/http/server.js
```

---

## 🧪 Testes

A suíte usa **uma única config** na raiz (`jest.config.ts`) que declara três _projects_ do Jest — `unit`, `integration` e `e2e` — cada um com escopo definido por `roots`.

```
tests/
├── unit/          services com fakes em memória, sem I/O
├── integration/   supertest contra Postgres + Redis reais
├── e2e/           reservado, sem specs ainda
└── support/       fakes/ + helpers/ + setup/ (nunca casado como teste)
```

```bash
yarn test                      # project unit (rápido, sem Docker)
yarn test:integration:up       # sobe postgres-test (5433) e redis-test (6380)
yarn test:integration          # project integration (serial)
yarn test:integration:down     # derruba a infra e apaga os volumes
yarn test:integration:local    # up + test + down
yarn test:e2e                  # project e2e (hoje passa com 0 testes)
yarn test:all                  # todos os projects, em série

yarn test -- CreateProjectService.spec.ts      # um arquivo
yarn test -- -t "should be able to create"     # por nome do caso
yarn test -- --coverage                        # coverage (não é automático)
TEST_LOGS=true yarn test:integration           # não silencia o LogProvider
```

Estado atual: **67 casos unitários** e **95 de integração** verdes. Alguns casos de integração estão comentados de propósito, com um comentário `// BUG: arquivo:linha` acima — são bugs conhecidos ainda abertos, rastreados no `CHECKLIST.md`. O CI reprova enquanto houver achado aberto, e o job que publica a imagem não roda nesse período.

Os testes unitários usam **fakes**, não mocks nem banco: `tests/support/fakes/` implementa as interfaces de repositório e de provider em memória, e o service sob teste é construído com `new`, passando os fakes pelo construtor — a tsyringe fica de fora. Os testes de integração falam **só HTTP**; o banco é acessado diretamente apenas para inspecionar cifra/IV ou envelhecer o `created_at` de um token. O único override de container é o `EmailProvider`.

A infra de teste vem do `docker-compose.test.yml` (Postgres na 5433, Redis na 6380 — as mesmas portas dos `services:` do CI, por isso o `.env.test` é compartilhado).

---

## 📜 Scripts do `package.json`

| Script                         | O que faz                                       |
| ------------------------------ | ----------------------------------------------- |
| `dev`                          | Servidor em modo desenvolvimento com hot reload |
| `build` / `build-local`        | Build de produção (com / sem copiar o `.env`)   |
| `start`                        | Executa a build compilada                       |
| `test*`                        | Suítes de teste (veja a seção acima)            |
| `lint` / `lint:fix`            | ESLint, zero warnings tolerados                 |
| `format` / `format:check`      | Prettier em `src/` e `tests/`                   |
| `up`                           | Sobe os containers do `docker-compose.yml`      |
| `migration:create -n <Nome>`   | Cria uma migration vazia                        |
| `migration:generate -n <Nome>` | Gera a migration a partir do diff das entidades |
| `migration:run`                | Aplica as migrations pendentes                  |
| `migration:revert`             | Reverte a última migration                      |

A config do CLI do TypeORM fica em `ormconfig.ts` (raiz), usada pelo driver `typeorm-ts-node-commonjs` nos comandos de migration — separada da conexão de runtime em `src/shared/infra/typeorm/index.ts`.

---

## 🏗️ Estrutura do projeto

```
/
├── build/                       # Código transpilado para produção
├── docker/                      # Configs de apoio (ex: prometheus.yml)
├── src/
│   ├── @types/                  # Augmentations de tipo (ex: Express.Request)
│   ├── config/                  # auth, upload, mail, etc.
│   ├── docs/swagger.json        # Especificação servida em /api-docs
│   ├── modules/                 # Um diretório por domínio
│   │   ├── users/
│   │   ├── projects/
│   │   ├── tags/
│   │   └── audit/
│   └── shared/
│       ├── container/           # Registro da injeção de dependência
│       ├── errors/              # AppError + ErrorHandler
│       ├── interfaces/
│       ├── providers/           # cache, cookie, cryptography, email, jwt, logs, storage
│       └── infra/
│           ├── http/            # app.ts, server.ts, routes, middleware, health, metrics
│           └── typeorm/         # conexão + migrations
├── tests/                       # unit / integration / e2e / support
├── .env.example                 # Modelo das variáveis de ambiente
├── .env.test                    # Ambiente dos testes (versionado, sem segredo real)
├── docker-compose.yml           # Stack de desenvolvimento
├── docker-compose.test.yml      # Postgres 5433 + Redis 6380 para os testes
├── Dockerfile
├── jest.config.ts               # Config única, com os projects unit/integration/e2e
├── ormconfig.ts                 # Config do CLI do TypeORM
└── tsconfig.json
```

Cada módulo em `src/modules/<domínio>/` segue o mesmo layering:

- `domain/models/` — interfaces da entidade e DTOs de escrita (`ICreateX`, `IUpdateX`, `IX`)
- `domain/repositories/` — **interfaces** de repositório (`IXRepository`), que os services consomem
- `infra/typeorm/entities/` — classes `@Entity` do TypeORM
- `infra/typeorm/repositories/` — implementações concretas das interfaces de domínio
- `infra/http/controllers/` — controllers finos: leem a request, resolvem o service no container, chamam `execute()`, formatam a resposta
- `infra/http/routes/` — encadeiam `isAuthenticated` + `requestValidation(schema)` + método do controller
- `infra/http/schemas/` — um schema yup por ação, validado contra `{ body, params, query }`
- `services/` — um caso de uso por classe, com um único `execute()`; regra de negócio mora aqui, não no controller
- `mapper(s)/` e `dtos/` — conversão entre entidade e o que o service devolve

### Path aliases

O `tsconfig.json` define `@shared/*`, `@modules/*`, `@config/*`, `@utils/*`, `@tests/*` e `@docs/*` — usados em vez de imports relativos. A resolução em runtime vem de `tsconfig-paths/register` (dev) e `tsc-alias` (build); o Jest resolve os mesmos aliases pelo `moduleNameMapper` do `jest.config.ts`. Ao adicionar um alias novo, atualize os dois lugares.

### Injeção de dependência

Repositórios e providers são registrados como singletons em `src/shared/container/index.ts` sob tokens string (`'UsersRepository'`, `'CacheProvider'`, …). Os services declaram `@injectable()` e recebem as dependências por `@inject('Token')`; os controllers os obtêm com `container.resolve(SomeService)` — nunca com `new` fora dos testes. O container também troca o provider conforme o ambiente: o provider de e-mail conforme `MAIL_DRIVER` (`ResendEmailProvider`, `SmtpEmailProvider` ou `EtherealEmailProvider`), `S3StorageProvider` ou `LocalStorageProvider` conforme `STORAGE_DISK`. `RefreshTokenService` é registrado como transiente — uma instância nova por resolve.

### Erros

`AppError` é o único erro esperado lançado pela aplicação, carregando `message`, `context` e `statusCode`. O `ErrorHandler`, montado por último em `app.ts`, formata as respostas de `AppError` e registra qualquer outra exceção como 500 com um `errorId` gerado, através do `LogProvider` injetado.

---

## 🚢 CI/CD

**CI** (`.github/workflows/ci.yml`), disparado em push e pull request:

1. `lint` — Prettier `--check` e ESLint
2. `test` — testes unitários, com upload do relatório de coverage
3. `integration` — testes de integração com `services:` de Postgres e Redis
4. `build` — `tsc` + `tsc-alias`
5. `docker` — build multi-arquitetura e push da imagem para o GHCR, exigindo os jobs anteriores verdes

O job de E2E já está escrito e comentado; basta descomentá-lo (e incluir `e2e` no `needs` do job `docker`) quando o primeiro spec entrar.

**CD** (`.github/workflows/cd.yml`) — disparado pelo `workflow_run` do CI: valida os secrets obrigatórios, aplica as migrations num container efêmero da imagem nova e faz o deploy na VPS via SSH, com rollback revertendo a última migration.

---

## 🔒 Roadmap de segurança

O roadmap completo de evolução de segurança está em **[ROADMAP.md](ROADMAP.md)** — do MVP até um Secrets Manager completo, dividido em 6 etapas progressivas. Consulte-o antes de mexer em autenticação, segredos ou infraestrutura.

O **[CHECKLIST.md](CHECKLIST.md)** acompanha as etapas em execução e a lista de achados de segurança/robustez ainda abertos, cada um com o arquivo e a linha correspondentes.

---

## 🤝 Como contribuir

Este é um projeto de estudo, mas contribuições são bem-vindas:

1. Faça um **fork** do projeto.
2. Crie uma **branch** (`git checkout -b feature/sua-feature` ou `fix/seu-fix`).
3. Rode `yarn lint`, `yarn format:check` e `yarn test` antes de commitar.
4. **Commit** seguindo [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m 'feat: adiciona funcionalidade X'`).
5. Envie para o seu fork (`git push origin feature/sua-feature`) e abra um **Pull Request**.

---

## 📝 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
