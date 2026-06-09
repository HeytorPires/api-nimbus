import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { createSessionSchema } from '../schemas/ICreateSessionSchema';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  requestValidation(createSessionSchema),
  sessionsController.create as any
);

export default sessionsRouter;
