import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { createSessionSchema } from '../schemas/ICreateSessionSchema';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import refreshTokenRateLimiter from '@shared/infra/http/middleware/refreshTokenRateLimiter';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  requestValidation(createSessionSchema),
  sessionsController.create
);

sessionsRouter.post(
  '/refresh',
  refreshTokenRateLimiter,
  sessionsController.refresh
);

sessionsRouter.delete('/', isAuthenticated, sessionsController.delete);

export default sessionsRouter;
