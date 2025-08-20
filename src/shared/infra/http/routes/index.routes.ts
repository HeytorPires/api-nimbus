import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import ProfileRouter from '@modules/users/infra/http/routes/profile.routes';
import tasksRouter from '@modules/tasks/infra/http/routes/tasks.routes';
import tagsRouter from '@modules/tags/infra/http/routes/tags.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', ProfileRouter);
routes.use('/tasks', tasksRouter)
routes.use('/tags', tagsRouter);

export default routes;
