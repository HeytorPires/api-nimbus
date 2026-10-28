import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import EmailsController from '../controllers/EmailsController';
import { emailShowSchema } from '../schemas/IShowEmailSchema';
import { emailUpdateStatusSchema } from '../schemas/IUpdateEmailStatusSchema';

const emailsRouter = Router();
const emailsController = new EmailsController();

emailsRouter.use(isAuthenticated);

emailsRouter.get(
  '/:id',
  requestValidation(emailShowSchema),
  emailsController.show
);

emailsRouter.patch(
  '/:id/status',
  requestValidation(emailUpdateStatusSchema),
  emailsController.updateStatus
);

export default emailsRouter;
