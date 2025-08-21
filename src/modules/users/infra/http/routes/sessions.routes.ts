import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import SessionsController from '../controllers/SessionsController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { createSessionSchema } from '../schemas/ICreateSessionSchema';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  requestValidation(createSessionSchema),
  sessionsController.create
);

export default sessionsRouter;
