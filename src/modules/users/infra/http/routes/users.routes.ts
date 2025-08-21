import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { tagCreateSchema } from '@modules/tags/infra/http/schemas/IUpdateTagSchema';

const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UserAvatarController();

const upload = multer({ storage: uploadConfig.Storage });

usersRouter.get('/', isAuthenticated, usersController.index);
usersRouter.post(
  '/',
  requestValidation(tagCreateSchema),
  usersController.create
);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update
);

export default usersRouter;
