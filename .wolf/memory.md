# Memory

> Chronological action log. Hooks and AI append to this file automatically.
> Old sessions are consolidated by the daemon weekly.

## Session: 2026-08-18 16:07

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-18 17:29

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-19 09:18

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-19 10:27

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-20 09:11

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 09:22 | Infra efêmera de teste (postgres 5433 / redis 6380, tmpfs) | docker-compose.test.yml, .env.test | subiu healthy | ~3k |
| 09:30 | Config Jest de integração + ignore de build/integration na unitária | jest.config.integration.ts, jest.config.ts | ok | ~4k |
| 09:35 | Setup da suíte: conexão, migrations, TRUNCATE + FLUSHDB, stub do typeorm | tests/integration/setup/* | ok após mover globalSetup para hooks | ~6k |
| 09:45 | Fluxo de auth ponta a ponta (cadastro, login, profile, refresh, logout) | tests/integration/auth/auth.flow.spec.ts, tests/integration/helpers/auth.ts | 20/20 verdes | ~9k |
| 10:05 | Job `integration` no CI + `docker` dependendo dele | .github/workflows/ci.yml | yaml validado | ~2k |
| 10:15 | Verificação: unitária 66/66, lint, format, build | — | tudo limpo | ~3k |
| 10:25 | Documentação dos 7 achados + STATUS/buglog | CHECKLIST.md, .wolf/STATUS.md, .wolf/buglog.json | ok | ~5k |

## Session: 2026-08-20 11:16

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-20 11:16

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-20 11:16

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 17:20 | Mapeamento (3 agentes Explore) da infra de integração, dos módulos projects/tags e do restante de users | src/modules/**, tests/integration/** | rotas, schemas, services, erros e DTOs catalogados | ~105k |
| 17:35 | Plano aprovado: CRUD completo em duas suítes (verde no CI, red fora) | plano da sessão | escopo "tudo" confirmado pelo usuário | ~15k |
| 17:45 | Config e scripts da suíte red | jest.config.integration.red.ts, jest.config.integration.ts, package.json | config standalone (import entre configs quebra em ESM) | ~6k |
| 17:50 | Helpers de recurso, arquivo e e-mail | tests/integration/helpers/{resources,files,mail}.ts | factories via HTTP, PNG em memória, FakeEmailProvider | ~8k |
| 18:00 | Suítes verdes de tags, projects, profile, avatar e password | tests/integration/{tags,projects,users}/*.spec.ts | 91/91 verdes (71 novos + 20 do auth) | ~35k |
| 18:10 | Suítes red dos 12 achados | tests/integration/**/*.bugs.red.spec.ts | 12/12 falhando como esperado | ~10k |
| 18:20 | Bookkeeping: Etapa 7 no CHECKLIST, STATUS, cerebrum, buglog | CHECKLIST.md, .wolf/* | handoff pronto; unitários 66/66, lint limpo | ~8k |

## Session: 2026-08-20 14:36

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-20 14:37

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-20 14:37

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 19:05 | Suíte red dissolvida: 12 casos movidos para o describe da rota nos specs de integração | tests/integration/{projects,tags,users,auth}/*.spec.ts | 100 casos, 14 falhando de propósito | ~18k |
| 19:10 | Bloco "Comportamento atual documentado" do auth convertido para o comportamento desejado | tests/integration/auth/auth.flow.spec.ts | 3 testes viraram 2 casos de bug + 1 movido para POST /users | ~4k |
| 19:15 | Aparato red removido | jest.config.integration.red.ts (deletado), jest.config.integration.ts, package.json, ci.yml | uma config e um script só; CI sem step informativo | ~3k |
| 19:25 | Bookkeeping da nova política | CHECKLIST.md, .wolf/{STATUS,cerebrum,anatomy}.md | Etapa 6 consolidada na 7; preferência antiga das duas suítes corrigida | ~9k |
| 19:50 | ormconfig de teste passou a descobrir entidades e migrations por glob absoluto | tests/integration/setup/ormconfig.ts | criar entidade/migration não exige mais editar o arquivo | ~6k |
| 19:55 | truncateAll deriva as tabelas do metadata da conexão | tests/integration/setup/database.ts | TEST_TABLES removido; ordem irrelevante com CASCADE | ~2k |

## Session: 2026-08-20 17:47

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-20 17:48

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-20 17:48

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-21 07:46

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-22 21:56

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 22:10 | Split de tests/integration/helpers/resources.ts em helpers por entidade (http/users/tags/projects) + imports das 5 specs | tests/integration/helpers/*, */*.spec.ts | 100 casos, mesmas 14 falhas conhecidas | ~9k |

## Session: 2026-08-22 22:44

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-22 22:50

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-22 22:50

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-22 22:50

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 22:58 | Corrigida validação de usuário perdida no refactor user_id->userId em CreateTagService; await nos expects do spec | src/modules/tags/services/CreateTagService.ts, tests/modules/tags/unit/CreateTagService.spec.ts | build, lint e 15 testes de tags verdes | ~25k |

## Session: 2026-08-22 23:54

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 23:58 | build+testes: corrigido TS2554 no DeleteProjectService.spec (assinatura com user_id) e adicionado caso de ownership | tests/modules/projects/unit/DeleteProjectService.spec.ts | build limpo, 21 suites / 67 testes verdes | ~8k |

## Session: 2026-08-22 00:01

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 00:20 | Padronização camelCase no código / snake_case no banco: rename em 68 arquivos (src+tests) com perl protegendo strings entre quotes, `name` explícito nos decorators das 4 entidades | src/modules/**, tests/**, src/docs/swagger.json | build, lint, format e 67 testes unitários verdes | ~60k |
| 00:21 | Tag: adicionado updatedAt (coluna existia na migration, faltava na entidade e em ITag) e removido @JoinColumn no-op sobre o @OneToMany | src/modules/tags/infra/typeorm/entities/Tag.ts, src/modules/tags/domain/models/ITag.ts | entidade alinhada com o schema | ~5k |
| 00:22 | CreateSessionsService passou a usar UserMapper.toDTO em vez de montar o user à mão (era o único ponto de resposta fora dos mappers; expunha avatar cru) | src/modules/users/services/CreateSessionsService.ts, src/modules/users/domain/models/ICreateSessions.ts | POST /sessions agora devolve avatarUrl | ~8k |
| 00:24 | Migration de rename das duas colunas fora do padrão + ordem de deploy corrigida no CD (migration antes do up -d, revert no rollback) | src/shared/infra/typeorm/migrations/1787368703953-*, .github/workflows/cd.yml | up e down validados no banco de teste; integração 95/98 (as 3 falhas são achados de bug já conhecidos) | ~20k |
| 00:35 | Descoberto que o migration:run do deploy nunca rodou: a imagem levava ormconfig.ts sem ts-node. Passou a copiar build/ormconfig.js; validado rodando o CLI dentro da imagem contra o Postgres de teste | Dockerfile | migration aplicada de dentro da imagem de produção | ~15k |


## Session: 2026-08-23 13:51

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-23 14:00

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-23 14:02

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-23 14:03

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-23 14:03

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-23 14:03

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 14:05 | Auditoria do código vs CHECKLIST.md: suíte de integração 95/95 verde, 11 dos 14 achados corrigidos; checklist reescrito (Etapa 1, Etapa 6/7, tabela de prioridade) | CHECKLIST.md | done | ~35k |

## Session: 2026-08-23 14:16

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-25 21:11

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-08-25 10:47

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 11:20 | Unificar suítes de teste num só `jest.config.ts` com projects `unit`/`integration`/`e2e`; árvore reorganizada em tests/{unit,integration,e2e,support} | jest.config.ts, package.json, .github/workflows/ci.yml, 49 arquivos em tests/, CLAUDE.md, README.md, CHECKLIST.md | 162 testes verdes (67 unit + 95 integration), e2e passa com 0, lint e tsc limpos | ~40k |


## Session: 2026-08-25 11:15

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 11:18 | README.md reescrito contra o código real (rotas, scripts, testes, CI/CD, estrutura) | README.md | ok | ~18k |
| 11:42 | swagger.json reescrito: 24 operacoes reais, cookieAuth, envelope de paginacao, AppError/ValidationError | src/docs/swagger.json | valido (swagger-parser), 24/24 casam com o router | ~22k |

## Session: 2026-08-25 14:33

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 15:18 | Auditoria da suíte e2e (project vazio) — mapeada infra de testes; discutida separação semântica unit/integration/e2e | jest.config.ts, tests/support/** (leitura) | integration está semanticamente correto; e2e só se paga como suíte de artefato (build compilado, conexão real, SIGTERM) | ~40k |
| 15:32 | Resíduo do pino removido: logger.ts órfão apagado, alias PinoProvider renomeado para LogProvider | logger.ts (del), src/shared/errors/ErrorHandler.ts | grep -ri pino vazio; tsc/lint/format limpos; unit 67/67, integration 95/95, build-local ok | ~8k |
| 20:15 | MinIO->RustFS + SDK minio->@aws-sdk/client-s3, MINIO_*->S3_* | docker-compose.yml, S3StorageProvider.ts, container/index.ts, .env*, README/CLAUDE/CHECKLIST | tsc/eslint/unit ok, sem teste real | ~9000 |

## Session: 2026-10-23 13:42

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
