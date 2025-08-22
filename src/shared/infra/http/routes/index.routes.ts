import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import ProfileRouter from '@modules/users/infra/http/routes/profile.routes';
import projectsRouter from '@modules/projects/infra/http/routes/projects.routes';
import tagsRouter from '@modules/tags/infra/http/routes/tags.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@docs/swagger.json';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', ProfileRouter);
routes.use('/projects', projectsRouter)
routes.use('/tags', tagsRouter);
routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default routes;
