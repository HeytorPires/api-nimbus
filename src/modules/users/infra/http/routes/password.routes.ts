import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { forgotPasswordSchema } from '../schemas/IForgotPasswordSchema';
import { resetPasswordSchema } from '../schemas/IResetPasswordSchema';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  requestValidation(forgotPasswordSchema),
  forgotPasswordController.create
);

passwordRouter.put(
  '/reset',
  requestValidation(resetPasswordSchema),
  resetPasswordController.Reset
);

export default passwordRouter;

