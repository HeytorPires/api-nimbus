# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-08-11T18:00:03.508Z
> Files: 186 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `.editorconfig` — Editor configuration (~62 tok)
- `.gitignore` — Git ignore rules (~40 tok)
- `.prettierrc` — Prettier configuration (~37 tok)
- `CHECKLIST.md` — 🚀 Checklist de Profissionalização — Backend (~1466 tok)
- `CLAUDE.md` — OpenWolf (~1563 tok)
- `docker-compose.yml` — Docker Compose services (~655 tok)
- `Dockerfile` — Docker container definition (~181 tok)
- `eslint.config.mjs` — ESLint flat configuration (~127 tok)
- `jest.config.ts` — Jest test configuration (~2023 tok)
- `LICENSE` — Project license (~284 tok)
- `logger.ts` (~16 tok)
- `ormconfig.ts` — /infra/typeorm/entities/*.js' (~220 tok)
- `package-lock.json` — npm lock file (~114050 tok)
- `package.json` — Node.js package manifest (~880 tok)
- `README.md` — Project documentation (~2434 tok)
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

## .github/workflows/

- `cd.yml` — CI: CD (~719 tok)
- `ci.yml` — CI: CI (~495 tok)

## docker/prometheus/

- `prometheus.yml` (~49 tok)

## src/@types/express/

- `index.d.ts` — Exports Request (~29 tok)

## src/config/

- `auth.ts` (~273 tok)
- `upload.ts` — Declares uploadFolder (~165 tok)

## src/docs/

- `swagger.json` (~4745 tok)

## src/modules/projects/domain/models/

- `ICreateProject.ts` — Exports ICreateProject (~54 tok)
- `IProject.ts` — Exports IProject (~118 tok)
- `IUpdateProject.ts` — Exports IUpdateProject (~48 tok)

## src/modules/projects/domain/repositories/

- `IProjectRepository.ts` — Exports IProjectRepository (~214 tok)

## src/modules/projects/dtos/

- `IProjectDTO.ts` — Exports IProjectDTO (~60 tok)

## src/modules/projects/infra/http/controllers/

- `ProjectsController.ts` — Exports ProjectsController (~756 tok)
  - class `ProjectsController` L9-79 (~592 tok)

## src/modules/projects/infra/http/routes/

- `projects.routes.ts` — API routes: GET, POST, PUT, DELETE (5 endpoints) (~376 tok)

## src/modules/projects/infra/http/schemas/

- `ICreateProjectSchema.ts` — Declares projectCreateSchema (~92 tok)
- `IDeleteProjectSchema.ts` — Declares projectDeleteSchema (~53 tok)
- `IListProjectSchema.ts` — Declares projectListSchema (~76 tok)
- `IShowProjectSchema.ts` — Declares projectShowSchema (~52 tok)
- `IUpdateProjectSchema.ts` — Declares projectUpdateSchema (~112 tok)

## src/modules/projects/infra/typeorm/entities/

- `Project.ts` — Declares Project (~313 tok)

## src/modules/projects/infra/typeorm/repositories/

- `ProjectsRepository.ts` — Zustand store (~753 tok)
  - class `ProjectsRepository` L9-96 (~595 tok)

## src/modules/projects/mapper/

- `ProjectMapper.ts` — Exports ProjectMapper (~190 tok)

## src/modules/projects/services/

- `CreateProjectService.ts` — Declares CreateProjectService (~773 tok)
  - class `CreateProjectService` L12-94 (~565 tok)
- `DeleteProjectService.ts` — Declares DeleteProjectService (~192 tok)
- `ListProjectService.ts` — Declares ListProjectService (~458 tok)
- `ShowProjectService.ts` — Declares ShowProjectService (~407 tok)
- `UpdateProjectService.ts` — Declares UpdateProjectService (~828 tok)
  - class `UpdateProjectService` L13-91 (~600 tok)

## src/modules/tags/domain/models/

- `ICreateTag.ts` — Exports ICreateTag (~21 tok)
- `ITag.ts` — Exports ITag (~52 tok)
- `IUpdateTag.ts` — Exports IUpdateTag (~25 tok)

## src/modules/tags/domain/repositories/

- `ITagRepository.ts` — Exports ITagRepository (~194 tok)

## src/modules/tags/dtos/

- `ITagDTO.ts` — Exports ITagDTO (~30 tok)

## src/modules/tags/infra/http/controllers/

- `TagsController.ts` — Exports TagsController (~614 tok)
  - class `TagsController` L9-63 (~472 tok)

## src/modules/tags/infra/http/routes/

- `tags.routes.ts` — API routes: GET, POST, PUT, DELETE (5 endpoints) (~335 tok)

## src/modules/tags/infra/http/schemas/

- `ICreateTagSchema.ts` — Declares tagCreateSchema (~46 tok)
- `IDeleteTagSchema.ts` — Declares tagDeleteSchema (~51 tok)
- `IListTagSchema.ts` — Declares tagListSchema (~73 tok)
- `IShowTagSchema.ts` — Declares tagShowSchema (~50 tok)
- `IUpdateTagSchema.ts` — Declares tagUpdateSchema (~66 tok)

## src/modules/tags/infra/typeorm/entities/

- `Tag.ts` — Declares Tag (~226 tok)

## src/modules/tags/infra/typeorm/repositories/

- `TagsRepository.ts` — Zustand store (~622 tok)
  - class `TagsRepository` L8-79 (~495 tok)

## src/modules/tags/mapper/

- `TagMapper.ts` — Exports TagMapper (~109 tok)

## src/modules/tags/services/

- `CreateTagService.ts` — Declares CreateTagService (~390 tok)
- `DeleteTagService.ts` — Declares DeleteTagService (~176 tok)
- `ListTagService.ts` — Declares ListTagService (~252 tok)
- `ShowTagService.ts` — Declares ShowTagService (~258 tok)
- `UpdateTagService.ts` — Declares UpdateTagService (~389 tok)

## src/modules/users/domain/dtos/

- `UserDTO.ts` — Exports UserDTO (~44 tok)

## src/modules/users/domain/models/

- `ICreateSessions.ts` — Exports IRequestCreateSession, IResponseCreateSession (~101 tok)
- `ICreateUser.ts` — Exports ICreateUser (~25 tok)
- `ICreateUserToken.ts` — Exports ICreateUserToken (~26 tok)
- `IResetPasswordUser.ts` — Exports IResetPasswordUser (~22 tok)
- `ISendForgotPasswordEmailUser.ts` — Exports ISendForgotPasswordEmailUser (~20 tok)
- `IUpdateProfileUser.ts` — Exports IUpdateProfileUser (~39 tok)
- `IUpdateUserAvatar.ts` — Exports IUpdateUserAvatar (~24 tok)
- `IUser.ts` — Exports IUser (~46 tok)
- `IUserToken.ts` — Exports IUserToken (~35 tok)

## src/modules/users/domain/repositories/

- `IUserRepository.ts` — Exports IUserRepository (~138 tok)
- `IUserTokensRepository.ts` — Exports ICreateUserToken, IUserTokensRepository (~147 tok)

## src/modules/users/infra/http/controllers/

- `ForgotPasswordController.ts` — Exports ForgotPasswordController (~161 tok)
- `ProfileController.ts` — Exports ProfileController (~281 tok)
- `ResetPasswordController.ts` — Exports ResetPasswordController (~156 tok)
- `SessionsController.ts` — Declares SessionsController (~689 tok)
  - class `SessionsController` L10-68 (~537 tok)
- `UserAvatarController.ts` — Exports UserAvatarController (~160 tok)
- `UsersController.ts` — Exports UsersController (~254 tok)

## src/modules/users/infra/http/routes/

- `password.routes.ts` — API routes: POST, PUT (2 endpoints) (~247 tok)
- `profile.routes.ts` — API routes: GET, PUT (2 endpoints) (~187 tok)
- `sessions.routes.ts` — API routes: POST, DELETE (3 endpoints) (~241 tok)
- `users.routes.ts` — API routes: GET, POST, PATCH (3 endpoints) (~286 tok)

## src/modules/users/infra/http/schemas/

- `ICreateSessionSchema.ts` — Declares createSessionSchema (~60 tok)
- `ICreateUserSchema.ts` — Declares createUserSchema (~68 tok)
- `IForgotPasswordSchema.ts` — Declares forgotPasswordSchema (~52 tok)
- `IResetPasswordSchema.ts` — Declares resetPasswordSchema (~112 tok)
- `IUpdateProfileSchema.ts` — Declares updateProfileSchema (~173 tok)

## src/modules/users/infra/typeorm/entities/

- `User.ts` — Declares User (~230 tok)
- `UserToken.ts` — Declares UserToken (~127 tok)

## src/modules/users/infra/typeorm/repositories/

- `UsersRepository.ts` — Declares UsersRepository (~420 tok)
- `UserTokensRepository.ts` — Declares UserTokensRepository (~456 tok)

## src/modules/users/mappers/

- `userMapper.ts` — Exports UserMapper (~272 tok)

## src/modules/users/services/

- `CreateSessionsService.ts` — Declares CreateSessionsService (~898 tok)
  - class `CreateSessionsService` L17-104 (~650 tok)
- `CreateUserService.ts` — Declares CreateUserService (~342 tok)
- `ListUserService.ts` — Declares ListUserService (~186 tok)
- `LogoutService.ts` — Declares LogoutService (~319 tok)
- `RefreshTokenService.ts` — Declares ITokenPayload (~1005 tok)
  - section `ITokenPayload` L12-16 (~17 tok)
  - section `IRefreshTokenResponse` L17-22 (~28 tok)
  - class `RefreshTokenService` L23-116 (~759 tok)
- `ResetPasswordservice.ts` — import { getCustomRepository } from 'typeorm'; (~608 tok)
  - class `ResetPasswordService` L14-62 (~395 tok)
- `SendForgotPasswordEmailService.ts` — Declares SendForgotPasswordEmailService (~792 tok)
  - class `SendForgotPasswordEmailService` L11-89 (~610 tok)
- `ShowProfileService.ts` — Declares ShowProfileService (~224 tok)
- `UpdateProfileService.ts` — Declares UpdateProfileService (~670 tok)
  - class `UpdateProfileService` L11-78 (~500 tok)
- `UpdateUserAvatarService.ts` — Declares UpdateUserAvatarService (~470 tok)

## src/modules/users/views/

- `forgot_password.hbs` (~160 tok)

## src/shared/container/

- `index.ts` — providers (~1121 tok)

## src/shared/errors/

- `AppError.ts` — Exports AppError (~91 tok)
- `ErrorHandler.ts` — Declares ErrorHandler (~398 tok)

## src/shared/infra/http/

- `app.ts` — API routes: GET (4 endpoints) (~533 tok)
- `server.ts` — Declares port (~85 tok)

## src/shared/infra/http/health/

- `healthcheck.ts` — Exports healthHandler, readyHandler (~316 tok)

## src/shared/infra/http/middleware/

- `isAuthenticated.ts` — ITokenPayload: isAuthenticated (~504 tok)
  - section `ITokenPayload` L9-14 (~26 tok)
  - fn `isAuthenticated` L15-60 (~346 tok)
- `metrics.ts` — Exports httpRequestDuration, metricsMiddleware, metricsHandler (~301 tok)
- `rateLimiter.ts` — redisCache: rateLimiter (~236 tok)
- `refreshTokenRateLimiter.ts` — initializeLimiter: refreshTokenRateLimiter (~307 tok)
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

## tests/modules/projects/repositories/

- `FakeProjectsRepository.ts` — Declares FakeProjectsRepository (~890 tok)
  - class `FakeProjectsRepository` L11-101 (~686 tok)

## tests/modules/projects/unit/

- `CreateProjectService.spec.ts` — import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider'; (~1509 tok)
- `DeleteProjectService.spec.ts` — Declares project (~355 tok)
- `ListProjectService.spec.ts` — Declares user_id (~833 tok)
- `ShowProjectService.spec.ts` — Declares user_id (~563 tok)
- `UpdateProjectService.spec.ts` — Declares user (~1806 tok)

## tests/modules/tags/repositories/

- `FakeTagsRepository.ts` — Declares FakeTagsRepository (~674 tok)
  - class `FakeTagsRepository` L8-88 (~539 tok)

## tests/modules/tags/unit/

- `CreateTagService.spec.ts` — Declares user (~513 tok)
- `DeleteTagService.spec.ts` — Declares user (~383 tok)
- `ListTagService.spec.ts` — Declares user (~809 tok)
- `ShowTagService.spec.ts` — Declares user (~555 tok)
- `UpdateTagService.spec.ts` — Declares user (~653 tok)

## tests/modules/user/repositories/

- `FakeUsersRepository.ts` — Declares FakeUsersRepository (~513 tok)
  - class `FakeUsersRepository` L6-67 (~408 tok)
- `FakeUsersTokensRepository.ts` — Declares FakeUserTokenRepository (~515 tok)
  - class `FakeUserTokenRepository` L9-60 (~412 tok)

## tests/modules/user/unit/

- `CreateSessionsService.spec.ts` — Declares user (~1082 tok)
- `CreateUserService.spec.ts` — Declares User (~434 tok)
- `ListUserService.spec.ts` — Declares response (~305 tok)
- `LogoutService.spec.ts` — Declares userId (~614 tok)
- `ResetPasswordService.spec.ts` — Declares User (~840 tok)
- `SendForgotPasswordEmailService.spec.ts` — Declares generateSpy (~633 tok)
- `ShowProfileService.spec.ts` — Declares id (~667 tok)
- `UpdateProfileService.spec.ts` — Declares createdUser (~991 tok)
- `UpdateUserAvatarService.spec.ts` — Declares user (~642 tok)

## tests/providers/fakes/

- `FakeCacheProvider.ts` — Exports FakeCacheProvider (~171 tok)
- `FakeCryptoProvider.ts` — Exports FakeCryptoProvider (~151 tok)
- `FakeEmailProvider.ts` — Exports FakeEmailProvider (~66 tok)
- `FakeHashProvider.ts` — Exports FakeHashProvider (~108 tok)
- `FakeJWTProvider.ts` — Exports FakeJWTProvider (~431 tok)
- `FakeLogProvider.ts` — Exports FakeLogProvider (~116 tok)
- `FakeStorageProvider.ts` — Exports FakeStorageProvider (~215 tok)

## tests/providers/unit/

- `EmailProvider.spec.ts` — Declares sendMailMock (~706 tok)

## tests/shared/http/

- `health.spec.ts` — API routes: GET (3 endpoints) (~561 tok)
