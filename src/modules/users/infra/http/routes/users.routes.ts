import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import { createUserSchema } from '../schemas/ICreateUserSchema';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UserAvatarController();

const upload = multer({ storage: uploadConfig.Storage });

usersRouter.get('/me', isAuthenticated, usersController.getUser);
usersRouter.post(
  '/',
  requestValidation(createUserSchema),
  usersController.create
);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar') as any,
  usersAvatarController.update
);

export default usersRouter;
