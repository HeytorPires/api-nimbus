import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';

import ProfileController from '../controllers/ProfileController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { updateProfileSchema } from '../schemas/IUpdateProfileSchema';

const ProfileRouter = Router();
const profileController = new ProfileController();

ProfileRouter.use(isAuthenticated);

ProfileRouter.get('/', profileController.show);
ProfileRouter.put(
  '/',
  requestValidation(updateProfileSchema),
  profileController.update
);

export default ProfileRouter;
