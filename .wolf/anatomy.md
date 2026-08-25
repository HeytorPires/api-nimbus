# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-08-25T14:00:39.202Z
> Files: 210 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `.dockerignore` — Docker ignore rules (~249 tok)
- `.editorconfig` — Editor configuration (~62 tok)
- `.gitignore` — Git ignore rules (~40 tok)
- `.prettierrc` — Prettier configuration (~37 tok)
- `CHECKLIST.md` — 🚀 Checklist de Profissionalização — Backend (~3773 tok)
- `CLAUDE.md` — OpenWolf (~2024 tok)
- `docker-compose.test.yml` — Postgres 5433 + Redis 6380 efêmeros (tmpfs) para os testes de integração; projeto compose `nimbus-test` (~296 tok)
- `docker-compose.yml` — Docker Compose services (~759 tok)
- `Dockerfile` — Docker container definition (~325 tok)
- `eslint.config.mjs` — ESLint flat configuration (~132 tok)
- `jest.config.ts` — Jest test configuration (unitário; ignora build/ e tests/integration/) (~842 tok)
- `LICENSE` — Project license (~284 tok)
- `ormconfig.ts` — /infra/typeorm/entities/*.js' (~220 tok)
- `package-lock.json` — npm lock file (~114050 tok)
- `package.json` — Node.js package manifest (~1017 tok)
- `README.md` — Project documentation (~2380 tok)
- `ROADMAP.md` — 🔒 Roadmap de Segurança (~1145 tok)
- `tsconfig.json` — TypeScript configuration (~420 tok)

## .claude/

- `settings.json` (~514 tok)

## .claude/commands/

- `reframe.md` — Mode: migrate [framework] (~551 tok)
- `security-audit.md` — Layer 1 — Dependencies (~510 tok)

## .claude/rules/

- `openwolf.md` (~328 tok)

## .github/

- `pull_request_template.md` — Pull Request Template (~347 tok)

## .github/actions/setup-node-deps/

- `action.yml` — CI: Setup Node & dependencies (~318 tok)

## .github/workflows/

- `cd.yml` — CI: CD (~1436 tok)
- `ci.yml` — CI: CI (~1873 tok)

## docker/prometheus/

- `prometheus.yml` (~46 tok)

## src/@types/express/

- `index.d.ts` — Exports Request (~36 tok)

## src/config/

- `auth.ts` (~273 tok)
- `context.ts` — Exports IRequestContext, requestContext (~68 tok)
- `upload.ts` — Declares uploadFolder (~165 tok)

## src/docs/

- `swagger.json` (~4556 tok)

## src/modules/projects/domain/models/

- `ICreateProject.ts` — Exports ICreateProject (~53 tok)
- `IProject.ts` — Exports IProject (~117 tok)
- `IUpdateProject.ts` — Exports IUpdateProject (~48 tok)

## src/modules/projects/domain/repositories/

- `IProjectRepository.ts` — Exports IProjectRepository (~213 tok)

## src/modules/projects/dtos/

- `IProjectDTO.ts` — Exports IProjectDTO (~58 tok)

## src/modules/projects/infra/http/controllers/

- `ProjectsController.ts` — Exports ProjectsController (~768 tok)
  - class `ProjectsController` L9-79 (~604 tok)

## src/modules/projects/infra/http/routes/

- `projects.routes.ts` — API routes: GET, POST, PUT, DELETE (5 endpoints) (~376 tok)

## src/modules/projects/infra/http/schemas/

- `ICreateProjectSchema.ts` — Declares projectCreateSchema (~91 tok)
- `IDeleteProjectSchema.ts` — Declares projectDeleteSchema (~53 tok)
- `IListProjectSchema.ts` — Declares projectListSchema (~76 tok)
- `IShowProjectSchema.ts` — Declares projectShowSchema (~52 tok)
- `IUpdateProjectSchema.ts` — Declares projectUpdateSchema (~112 tok)

## src/modules/projects/infra/typeorm/entities/

- `Project.ts` — Declares Project (~324 tok)

## src/modules/projects/infra/typeorm/repositories/

- `ProjectsRepository.ts` — Zustand store (~752 tok)
  - class `ProjectsRepository` L9-96 (~594 tok)

## src/modules/projects/mapper/

- `ProjectMapper.ts` — Exports ProjectMapper (~188 tok)

## src/modules/projects/services/

- `CreateProjectService.ts` — Declares CreateProjectService (~770 tok)
  - class `CreateProjectService` L12-94 (~562 tok)
- `DeleteProjectService.ts` — Declares DeleteProjectService (~232 tok)
- `ListProjectService.ts` — Declares ListProjectService (~457 tok)
- `ShowProjectService.ts` — Declares ShowProjectService (~406 tok)
- `UpdateProjectService.ts` — Declares UpdateProjectService (~879 tok)
  - class `UpdateProjectService` L14-96 (~635 tok)

## src/modules/tags/domain/models/

- `ICreateTag.ts` — Exports ICreateTag (~20 tok)
- `ITag.ts` — Exports ITag (~54 tok)
- `IUpdateTag.ts` — Exports IUpdateTag (~25 tok)

## src/modules/tags/domain/repositories/

- `ITagRepository.ts` — Exports ITagRepository (~176 tok)

## src/modules/tags/dtos/

- `ITagDTO.ts` — Exports ITagDTO (~30 tok)

## src/modules/tags/infra/http/controllers/

- `TagsController.ts` — Exports TagsController (~625 tok)
  - class `TagsController` L9-65 (~482 tok)

## src/modules/tags/infra/http/routes/

- `tags.routes.ts` — API routes: GET, POST, PUT, DELETE (5 endpoints) (~335 tok)

## src/modules/tags/infra/http/schemas/

- `ICreateTagSchema.ts` — Declares tagCreateSchema (~46 tok)
- `IDeleteTagSchema.ts` — Declares tagDeleteSchema (~51 tok)
- `IListTagSchema.ts` — Declares tagListSchema (~73 tok)
- `IShowTagSchema.ts` — Declares tagShowSchema (~50 tok)
- `IUpdateTagSchema.ts` — Declares tagUpdateSchema (~66 tok)

## src/modules/tags/infra/typeorm/entities/

- `Tag.ts` — Declares Tag (~241 tok)

## src/modules/tags/infra/typeorm/repositories/

- `TagsRepository.ts` — Zustand store (~608 tok)
  - class `TagsRepository` L7-81 (~498 tok)

## src/modules/tags/mapper/

- `TagMapper.ts` — Exports TagMapper (~108 tok)

## src/modules/tags/services/

- `CreateTagService.ts` — Declares CreateTagService (~377 tok)
- `DeleteTagService.ts` — Declares DeleteTagService (~214 tok)
- `ListTagService.ts` — Declares ListTagService (~251 tok)
- `ShowTagService.ts` — Declares ShowTagService (~258 tok)
- `UpdateTagService.ts` — Declares UpdateTagService (~504 tok)
  - class `UpdateTagService` L11-59 (~357 tok)

## src/modules/users/domain/dtos/

- `UserDTO.ts` — Exports UserDTO (~43 tok)

## src/modules/users/domain/models/

- `ICreateSessions.ts` — Exports IRequestCreateSession, IResponseCreateSession (~72 tok)
- `ICreateUser.ts` — Exports ICreateUser (~25 tok)
- `ICreateUserToken.ts` — Exports ICreateUserToken (~26 tok)
- `IResetPasswordUser.ts` — Exports IResetPasswordUser (~22 tok)
- `ISendForgotPasswordEmailUser.ts` — Exports ISendForgotPasswordEmailUser (~20 tok)
- `IUpdateProfileUser.ts` — Exports IUpdateProfileUser (~39 tok)
- `IUpdateUserAvatar.ts` — Exports IUpdateUserAvatar (~24 tok)
- `IUser.ts` — Exports IUser (~46 tok)
- `IUserToken.ts` — Exports IUserToken (~34 tok)

## src/modules/users/domain/repositories/

- `IUserRepository.ts` — Exports IUserRepository (~138 tok)
- `IUserTokensRepository.ts` — Exports ICreateUserToken, IUserTokensRepository (~146 tok)

## src/modules/users/infra/http/controllers/

- `ForgotPasswordController.ts` — Exports ForgotPasswordController (~161 tok)
- `ProfileController.ts` — Exports ProfileController (~279 tok)
- `ResetPasswordController.ts` — Exports ResetPasswordController (~156 tok)
- `SessionsController.ts` — Declares SessionsController (~689 tok)
  - class `SessionsController` L10-68 (~537 tok)
- `UserAvatarController.ts` — Exports UserAvatarController (~159 tok)
- `UsersController.ts` — Exports UsersController (~254 tok)

## src/modules/users/infra/http/routes/

- `password.routes.ts` — API routes: POST, PUT (2 endpoints) (~247 tok)
- `profile.routes.ts` — API routes: GET, PUT (2 endpoints) (~187 tok)
- `sessions.routes.ts` — API routes: POST, DELETE (3 endpoints) (~241 tok)
- `users.routes.ts` — API routes: GET, POST, PATCH (3 endpoints) (~286 tok)

## src/modules/users/infra/http/schemas/

- `ICreateSessionSchema.ts` — Declares createSessionSchema (~60 tok)
- `ICreateUserSchema.ts` — Declares createUserSchema (~74 tok)
- `IForgotPasswordSchema.ts` — Declares forgotPasswordSchema (~52 tok)
- `IResetPasswordSchema.ts` — Declares resetPasswordSchema (~112 tok)
- `IUpdateProfileSchema.ts` — Declares updateProfileSchema (~172 tok)

## src/modules/users/infra/typeorm/entities/

- `User.ts` — Declares User (~230 tok)
- `UserToken.ts` — Declares UserToken (~136 tok)

## src/modules/users/infra/typeorm/repositories/

- `UsersRepository.ts` — Declares UsersRepository (~420 tok)
- `UserTokensRepository.ts` — Declares UserTokensRepository (~454 tok)

## src/modules/users/mappers/

- `userMapper.ts` — Exports UserMapper (~271 tok)

## src/modules/users/services/

- `CreateSessionsService.ts` — Declares CreateSessionsService (~895 tok)
  - class `CreateSessionsService` L19-104 (~649 tok)
- `CreateUserService.ts` — Declares CreateUserService (~342 tok)
- `ListUserService.ts` — Declares ListUserService (~186 tok)
- `LogoutService.ts` — Declares LogoutService (~361 tok)
- `RefreshTokenService.ts` — Declares ITokenPayload (~1005 tok)
  - section `ITokenPayload` L12-16 (~17 tok)
  - section `IRefreshTokenResponse` L17-22 (~28 tok)
  - class `RefreshTokenService` L23-116 (~759 tok)
- `ResetPasswordservice.ts` — import { getCustomRepository } from 'typeorm'; (~625 tok)
  - class `ResetPasswordService` L14-64 (~411 tok)
- `SendForgotPasswordEmailService.ts` — Declares SendForgotPasswordEmailService (~891 tok)
  - class `SendForgotPasswordEmailService` L12-99 (~692 tok)
- `ShowProfileService.ts` — Declares ShowProfileService (~223 tok)
- `UpdateProfileService.ts` — Declares UpdateProfileService (~718 tok)
  - class `UpdateProfileService` L12-83 (~533 tok)
- `UpdateUserAvatarService.ts` — Declares UpdateUserAvatarService (~469 tok)

## src/modules/users/views/

- `forgot_password.hbs` (~160 tok)

## src/shared/container/

- `index.ts` — providers (~1121 tok)

## src/shared/errors/

- `AppError.ts` — Exports AppError (~91 tok)
- `ErrorHandler.ts` — Declares ErrorHandler (~438 tok)

## src/shared/infra/http/

- `app.ts` — API routes: GET (4 endpoints) (~566 tok)
- `healthcheck.ts` — Exports healthHandler, readyHandler (~316 tok)
- `metrics.ts` — Exports httpRequestDuration, metricsMiddleware, metricsHandler (~301 tok)
- `server.ts` — Declares port (~85 tok)

## src/shared/infra/http/middleware/

- `isAuthenticated.ts` — ITokenPayload: isAuthenticated (~504 tok)
  - section `ITokenPayload` L9-14 (~26 tok)
  - fn `isAuthenticated` L15-60 (~346 tok)
- `rateLimiter.ts` — redisCache: rateLimiter (~236 tok)
- `refreshTokenRateLimiter.ts` — initializeLimiter: refreshTokenRateLimiter (~307 tok)
- `requestContext.ts` — Declares requestContextMiddleware (~125 tok)
- `requestValidation.ts` — Adicionamos o tipo de retorno explícito: Promise<void> (~221 tok)

## src/shared/infra/http/routes/

- `index.routes.ts` — Declares routes (~284 tok)
- `index.ts` — Declares routes (~222 tok)

## src/shared/infra/typeorm/

- `index.ts` (~48 tok)

## src/shared/infra/typeorm/migrations/

- `1737498474377-CreateUsers.ts` — Exports CreateUsers1737498474377 (~373 tok)
- `1738429655796-CreateUserTokens.ts` — Exports CreateUserTokens1738429655796 (~432 tok)
- `1755221997757-CreateProjects.ts` — Exports CreateTasks1755221997757 (~584 tok)
  - class `CreateTasks1755221997757` L8-81 (~534 tok)
- `1755555823981-AddCollumnInitializationVector.ts` — Exports AddColumnInitializationVector1755555823981 (~163 tok)
- `1755715171256-CreateTableTags.ts` — Exports CreateTableTags1755715171256 (~400 tok)
- `1755717077159-AddColumntagIdToProjects.ts` — Exports AddColumntagIdToTasks1755717077159 (~308 tok)
- `1787368703953-RenameProjectColumnsToSnakeCase.ts` — Renomeia projects.variablesEnvironment -> variables_environment e projects.InitializationVector -> initialization_vector; up/down simétricos via renameColumn (~221 tok)

## src/shared/interfaces/

- `IPaginationReturn.ts` — Exports IPaginationReturn (~35 tok)

## src/shared/providers/cache/implementations/

- `RedisCache.ts` — Exports RedisCache (~262 tok)

## src/shared/providers/cache/models/

- `ICacheProvider.ts` — Exports ICacheProvider (~71 tok)

## src/shared/providers/cookie/implementations/

- `CookieProvider.ts` — Define o cookie de Refresh Token na resposta HTTP. (~706 tok)
  - class `CookieProvider` L5-80 (~640 tok)

## src/shared/providers/cookie/models/

- `ICookieProvider.ts` — Define o cookie de Refresh Token na resposta HTTP. (~229 tok)

## src/shared/providers/cryptography/implementations/

- `BcryptHashProvider.ts` — Exports BcryptHashProvider (~119 tok)
- `CryptoProvider.ts` — Exports BcryptHashProvider (~331 tok)

## src/shared/providers/cryptography/models/

- `ICryptographyProvider.ts` — Exports ICryptographyProvider (~53 tok)
- `IHashProvider.ts` — Exports IHashProvider (~44 tok)

## src/shared/providers/email/implementations/

- `EtherealEmailProvider.ts` — Factory method to create EtherealEmailProvider with dynamic test account credentials. (~614 tok)
  - class `EtherealEmailProvider` L6-72 (~530 tok)
- `HandlebarsMailTemplate.ts` — Exports HandlebarsMailTemplate (~133 tok)
- `NodeMailerProvider.ts` — Exports NodeMailerProvider (~344 tok)

## src/shared/providers/email/models/

- `ISendMail.ts` — Exports IParseMailTemplate, ISendMail (~105 tok)
- `ISmtpProvider.ts` — Exports ISmtpProvider (~45 tok)

## src/shared/providers/jwt/implementations/

- `JsonWebTokenProvider.ts` — Exports JsonWebTokenProvider (~134 tok)

## src/shared/providers/jwt/models/

- `IJWTProvider.ts` — Exports IJWTProvider (~61 tok)

## src/shared/providers/logs/implementations/

- `LogProvider.ts` — Exports LogProvider (~231 tok)

## src/shared/providers/logs/models/

- `ILogProvider.ts` — Exports ILogProvider (~64 tok)
- `IWriteLog.ts` — Exports IWriteLog (~46 tok)

## src/shared/providers/storage/implementations/

- `LocalStorageProvider.ts` — Exports LocalStorageProvider (~412 tok)
- `MinioStorageProvider.ts` — Exports MinioStorageProvider (~568 tok)
  - class `MinioStorageProvider` L8-68 (~494 tok)

## src/shared/providers/storage/models/

- `IStorageProvider.ts` — Exports IStorageProvider (~87 tok)

## tests/e2e/

- `.gitkeep` (~0 tok)

## tests/integration/auth/

- `auth.flow.spec.ts` — 22 casos: cadastro, login, profile, refresh (rotação de jti), logout, 4 bugs abertos (~2756 tok)

## tests/integration/projects/

- `projects.crud.spec.ts` — 32 casos: CRUD, cifra AES no banco, decrypt, tag_id, paginação, cascade, 6 bugs abertos (~4622 tok)

## tests/integration/tags/

- `tags.crud.spec.ts` — 20 casos: CRUD, unicidade por usuário, paginação, isolamento, 2 bugs abertos (~2537 tok)

## tests/integration/users/

- `avatar.spec.ts` — 5 casos: upload multipart, avatar_url, GET /files/:filename, troca de avatar (~828 tok)
- `password.spec.ts` — 9 casos: forgot/reset com EmailProvider fake, token envelhecido, 2 bugs abertos (~1535 tok)
- `profile.crud.spec.ts` — 13 casos: /users/me, GET/PUT /profile, troca de senha revalidada por login (~1703 tok)

## tests/support/fakes/

- `FakeCacheProvider.ts` — Exports FakeCacheProvider (~171 tok)
- `FakeCryptoProvider.ts` — Exports FakeCryptoProvider (~151 tok)
- `FakeEmailProvider.ts` — Exports FakeEmailProvider (~66 tok)
- `FakeHashProvider.ts` — Exports FakeHashProvider (~105 tok)
- `FakeJWTProvider.ts` — Exports FakeJWTProvider (~431 tok)
- `FakeLogProvider.ts` — Exports FakeLogProvider (~116 tok)
- `FakeProjectsRepository.ts` — Declares FakeProjectsRepository (~886 tok)
  - class `FakeProjectsRepository` L11-101 (~682 tok)
- `FakeStorageProvider.ts` — Exports FakeStorageProvider (~215 tok)
- `FakeTagsRepository.ts` — Declares FakeTagsRepository (~651 tok)
  - class `FakeTagsRepository` L8-91 (~540 tok)
- `FakeUsersRepository.ts` — Declares FakeUsersRepository (~500 tok)
  - class `FakeUsersRepository` L6-67 (~408 tok)
- `FakeUsersTokensRepository.ts` — Declares FakeUserTokenRepository (~510 tok)
  - class `FakeUserTokenRepository` L9-60 (~407 tok)

## tests/support/helpers/

- `auth.ts` — API routes: POST, GET (3 endpoints) (~616 tok)
  - fn `createUser` L16-25 (~77 tok)
  - fn `login` L26-32 (~46 tok)
  - fn `authenticatedAgent` L33-46 (~108 tok)
  - fn `otherUserAgent` L47-54 (~51 tok)
  - fn `findUserTokens` L55-61 (~55 tok)
  - fn `findCachedSession` L62-69 (~58 tok)
  - fn `getSetCookie` L70-80 (~75 tok)
- `files.ts` — Pasta onde o LocalStorageProvider e o multer gravam (<root>/uploads). (~376 tok)
- `http.ts` — UUID válido que não existe em nenhuma tabela. (~89 tok)
- `mail.ts` — Substitui o EmailProvider do container por um fake. (~346 tok)
- `projects.ts` — Colunas cruas do projeto no banco — usadas para provar que (~329 tok)
- `tags.ts` — API routes: POST (1 endpoints) (~100 tok)

## tests/support/setup/

- `database.ts` — Cliente Redis do container. É o mesmo cliente que o `rateLimiter` usa, então (~371 tok)
- `env.ts` (~43 tok)
- `hooks.ts` — Abre a conexão default esperando a infra subir. (~624 tok)
  - fn `connectWithRetry` L21-73 (~387 tok)
- `ormconfig.ts` — /infra/typeorm/entities/*.ts`], (~197 tok)
- `typeormStub.ts` — Stub de `@shared/infra/typeorm`. (~130 tok)

## tests/unit/modules/projects/

- `CreateProjectService.spec.ts` — import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider'; (~1457 tok)
- `DeleteProjectService.spec.ts` — Declares project (~513 tok)
- `ListProjectService.spec.ts` — Declares userId (~830 tok)
- `ShowProjectService.spec.ts` — Declares userId (~562 tok)
- `UpdateProjectService.spec.ts` — Declares user (~1740 tok)

## tests/unit/modules/tags/

- `CreateTagService.spec.ts` — Declares user (~495 tok)
- `DeleteTagService.spec.ts` — Declares user (~377 tok)
- `ListTagService.spec.ts` — Declares user (~782 tok)
- `ShowTagService.spec.ts` — Declares user (~536 tok)
- `UpdateTagService.spec.ts` — Declares user (~628 tok)

## tests/unit/modules/users/

- `CreateSessionsService.spec.ts` — Declares user (~1070 tok)
- `CreateUserService.spec.ts` — Declares User (~433 tok)
- `ListUserService.spec.ts` — Declares response (~305 tok)
- `LogoutService.spec.ts` — Declares userId (~612 tok)
- `ResetPasswordService.spec.ts` — Declares User (~839 tok)
- `SendForgotPasswordEmailService.spec.ts` — Declares generateSpy (~634 tok)
- `ShowProfileService.spec.ts` — Declares id (~664 tok)
- `UpdateProfileService.spec.ts` — Declares createdUser (~987 tok)
- `UpdateUserAvatarService.spec.ts` — Declares user (~640 tok)

## tests/unit/providers/

- `EmailProvider.spec.ts` — Declares sendMailMock (~703 tok)

## tests/unit/shared/http/

- `health.spec.ts` — API routes: GET (3 endpoints) (~561 tok)
