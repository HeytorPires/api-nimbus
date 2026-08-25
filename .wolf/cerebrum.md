# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-08-22

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->

- Comunicação em português; comentários e documentação persistida em prosa normal.
- Para testes de integração, preferiu `docker-compose` dedicado a testcontainers: evita dependência nova e download de imagem por execução.
- Suíte unitária não pode passar a exigir Docker — configs de Jest separadas, `yarn test` continua offline.
- [2026-08-20] Quando testes revelam bugs: **uma suíte só**, e o caso de bug vive no `describe` da rota que exercita, afirmando o comportamento **desejado** com `it()` normal — o teste falha e a mensagem `Expected`/`Received` aparece no output. Sem suíte paralela, sem `it.failing`, sem `skip`: o usuário rejeitou explicitamente "módulo red" como estrutura de projeto ("não é normal ter um módulo de red num projeto"), e quer ver os erros ao rodar a rotina normal de testes.
- Cada caso de bug carrega um comentário `// BUG: arquivo:linha — o que deveria acontecer`, para servir de guia da correção.
- **A correção do código de produção é feita por ele, lendo os testes** — não corrigir junto sem pedido explícito.
- Prefere que o CI reprove enquanto houver bug conhecido (o job `docker` para de publicar imagem): "código com bug conhecido não vira artefato" vale mais que pipeline verde.
- [2026-08-22] **Convenção de nomes: banco em snake_case, código e contrato HTTP em camelCase.** Vale para entidade, interfaces de domínio, DTOs, mappers, schemas yup, payload de request e corpo de resposta. Preferiu `@Column({ name: 'user_id' })` explícito a uma `SnakeNamingStrategy` global: sem dependência nova e o nome físico fica visível no arquivo.
- [2026-08-22] Refactor que toca schema tem que ser **feito de um jeito que não quebre produção** — pediu isso explicitamente. Mudança de schema vai em fase/commit separado do refactor de código, e a ordem do deploy é parte da entrega.

## Key Learnings

- **Project:** api-nimbus
- **Description:** Um projeto de API back-end desenvolvido com Node.js e TypeScript, focado em estudos e na aplicação de boas práticas de desenvolvimento de software.
- **Testes (estrutura unificada desde 2026-08-25):** um só `jest.config.ts` na raiz com três *projects* (`unit`, `integration`, `e2e`), cada um com escopo por `roots`. Árvore: `tests/unit/` (fakes + `new` direto, sem tsyringe), `tests/integration/` (supertest contra Postgres/Redis reais), `tests/e2e/` (reservado, vazio), `tests/support/{fakes,helpers,setup}` (compartilhado, nunca casado como teste). Scripts: `yarn test` (unit), `yarn test:integration`, `yarn test:e2e`, `yarn test:all`. Infra em `docker-compose.test.yml`.
- **`maxWorkers` não é aceito dentro de `projects` do Jest** (só na raiz da config). A integração precisa ser serial (o `TRUNCATE` de um worker derruba o outro), então a serialização vem do `--runInBand` no script, e cada tipo é invocado por `--selectProjects` em vez de uma run única. Opções de coverage também só valem na raiz — o Jest as ignora dentro de um project.
- **Imports dentro de `tests/` usam o alias `@tests/*`** (`@tests/support/fakes/...`, `@tests/support/helpers/...`); relativo só entre irmãos do mesmo diretório. Isso desacopla os specs da profundidade da pasta.
- **TypeORM é 0.2.x:** API legada (`createConnection`, `getConnection`, `getRepository`), sem `DataSource`. `src/shared/infra/typeorm/index.ts` chama `createConnection` como side effect do import, sem `await` e sem export — quem precisa controlar a conexão tem que substituir esse módulo.
- **Ordem de env importa:** `@config/auth`, `ormconfig` e `src/shared/container/index.ts` leem `process.env` em tempo de import; o `dotenv.config()` de `app.ts` roda depois dos imports e chega tarde. Em testes, carregar env em `setupFiles`.
- **Importar `app.ts` já toca infra:** `middleware/rateLimiter.ts` resolve o `CacheProvider` e instancia `RateLimiterRedis` no topo do módulo, então subir o Express exige Redis vivo (ou mock).
- **Substituir provider em teste de integração:** `container.registerInstance('EmailProvider', fake)` sobrescreve o singleton registrado no import do container; como os services são resolvidos por request no controller, o override vale a partir da requisição seguinte. Usado para o `FakeEmailProvider` (`NODE_ENV=test` cai no `NodeMailerProvider`, SMTP real — só `development` usa o Ethereal).
- **`uploads/` é uma pasta só:** `src/config/upload.ts` (multer) e `LocalStorageProvider` resolvem ambos para `<root>/uploads`, compartilhada com o ambiente de dev. Testes removem apenas os arquivos cujos nomes capturaram.
- **Colunas uuid do Postgres estouram com string não-uuid:** buscar `user_tokens.token = 'qualquer-coisa'` gera erro de driver (500) antes de qualquer regra do service. Em teste, usar um uuid válido inexistente.
- **TypeORM 0.2 usa `DefaultNamingStrategy`:** o nome da coluna é o nome da propriedade TypeScript **verbatim**, sem conversão camelCase→snake_case. Logo, propriedade em camelCase exige `name` explícito no decorator (`@Column`, `@CreateDateColumn`, `@UpdateDateColumn`). Já `@JoinColumn({ name: ... })` sempre usou o nome físico e não muda.
- **Chaves de `where`/`order` do TypeORM são nomes de propriedade, não de coluna:** renomear a propriedade da entidade arrasta as queries do repositório de graça. O que continua preso ao nome físico é SQL cru (`connection().query(...)`) e as migrations.
- **A fronteira de saída são os 3 mappers** (`userMapper`, `TagMapper`, `ProjectMapper`): toda resposta HTTP passa por eles — desde 2026-08-22 inclusive `POST /sessions`, que antes montava o objeto `user` à mão e vazava `avatar` cru em vez de `avatarUrl`.
- **Providers que explodem sem env:** `CryptoProvider` lê `CRYPTO_SECRET_KEY` em field initializer (precisa de 64 chars hex); `NODE_ENV=development` registra `EtherealEmailProvider` sem `@injectable`, que resolve com transporter `undefined`.

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->

- [2026-08-20] Não colocar setup de banco no `globalSetup` do Jest: ele roda fora do `moduleNameMapper`, então os aliases `@modules/@shared` não resolvem (nem nos requires em cascata das entidades). Usar `setupFilesAfterEnv`.
- [2026-08-20] ~~Não declarar entidades/migrations por glob de `.ts` numa config de TypeORM usada dentro do Jest.~~ **Errado, verificado no mesmo dia:** o glob funciona — o `require` interno do TypeORM passa pelo runtime do Jest e o ts-jest compila o arquivo. O que quebra é glob **relativo**: o cwd dentro do Jest não é necessariamente a raiz, e o padrão não casa nada (conexão sobe sem entidades). Usar caminho absoluto a partir de `__dirname`, como em `tests/integration/setup/ormconfig.ts`.
- [2026-08-20] Não importar `jest.config.integration.ts` de dentro de outra config Jest (`import cfg from './jest.config.integration'`): o Jest carrega o arquivo via ESM e o import relativo sem extensão falha com `ERR_MODULE_NOT_FOUND`. Cada config `.ts` de Jest tem que ser standalone. (Desde 2026-08-25 existe uma config só, com `projects`; ela é autocontida — o bloco de `paths` é literal dentro do arquivo.)
- [2026-08-25] Não deixar um project do Jest apontando para diretório vazio sem `passWithNoTests: true` na raiz: a run inteira sai com erro "no tests found" por causa do slot `e2e`.
- [2026-08-25] Em zsh, `files=$(find ...)` seguido de `sed -i $files` **não** faz word splitting: a string inteira vira um único nome de arquivo e o sed falha com "can't read". Usar `find -print0 | xargs -0 sed -i`.
- [2026-08-20] Não escrever teste de integração para `GET /files/<inexistente>`: o handler (`app.ts:43-62`) pendura a request (o ENOENT vem no evento `error` do stream, fora do try/catch) e a suíte só sai por timeout de 30s.
- [2026-08-20] Compose auxiliar sem `name:` herda o nome de projeto do diretório e colide com os containers do `docker-compose.yml` de dev (erro de nome de container em uso).

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->

- [2026-08-20] **Testes de integração com `docker-compose.test.yml`, não testcontainers.** Portas 5433/6380 e `tmpfs` convivem com a infra de dev; no CI o mesmo `.env.test` serve para os `services:` do GitHub Actions. Testcontainers custaria 2 devDeps e startup por execução.
- [2026-08-20] **Configs de Jest separadas** (`jest.config.ts` unitário, `jest.config.integration.ts`): `yarn test` segue rápido e sem Docker; a integração roda serial (`maxWorkers: 1`) porque banco e Redis são compartilhados.
- [2026-08-20] **Redis real em vez de mock na integração:** o `rateLimiter` e o fluxo de sessão (`session:<userId>`, TTL, contadores de rate limit) só se comportam de verdade com Redis; `FLUSHDB` no `beforeEach` dá o isolamento.
- [2026-08-20] ~~**Os testes documentam o comportamento atual, não o desejado.**~~ **Revertido no mesmo dia:** os testes passaram a afirmar o comportamento desejado e a falhar. Os achados continuam no `CHECKLIST.md`, mas a correção do código segue fora do escopo da leva de testes.
- [2026-08-20] **Bug conhecido vira teste que falha na suíte principal, não suíte separada nem `it.failing`.** A suíte red (`jest.config.integration.red.ts` + `yarn test:integration:red`) durou uma leva e foi dissolvida no mesmo dia: `it.failing` manteria CI verde mas esconde a mensagem do erro, e suíte paralela não é convenção de projeto. Ficou: caso de bug no `describe` da rota, `it()` normal, `yarn test:integration` com exit 1, job `integration` reprovando e `docker` sem publicar imagem até a suíte ficar verde.
- [2026-08-20] **Os 3 testes do bloco "Comportamento atual documentado" de `auth.flow.spec.ts` foram convertidos** para afirmar o comportamento desejado, pela mesma política — não há mais teste que passa fixando bug.
- [2026-08-22] **camelCase no código via `@Column({ name })`, não via `SnakeNamingStrategy`.** A strategy global seria menos verbosa e à prova de esquecimento, mas exigiria a dependência `typeorm-naming-strategies`, escaparia com `name` explícito as duas colunas fora do padrão de qualquer forma, e mudaria os nomes de índice/FK gerados por `migration:generate`.
- [2026-08-22] **O rename das colunas `projects.variablesEnvironment`/`InitializationVector` foi separado do refactor de código**, porque o `cd.yml` subia a imagem nova **antes** de rodar as migrations: com rename puro, a versão em execução procuraria uma coluna que ainda não existe. A migration passou a rodar num container efêmero da imagem nova (`docker compose run --rm --no-deps --name nimbus-api-migrate node npx typeorm migration:run`) antes do `up -d`, e o path de rollback ganhou `migration:revert` antes de voltar `PREVIOUS_TAG`.

