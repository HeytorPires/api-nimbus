import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { createSessionSchema } from '../schemas/ICreateSessionSchema';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  requestValidation(createSessionSchema),
  sessionsController.create
);

sessionsRouter.delete('/', isAuthenticated, sessionsController.delete);

export default sessionsRouter;
