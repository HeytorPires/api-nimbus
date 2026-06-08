import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import TagsController from '../controllers/TagsController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { tagCreateSchema } from '../schemas/ICreateTagSchema';
import { tagUpdateSchema } from '../schemas/IUpdateTagSchema';
import { tagShowSchema } from '../schemas/IShowTagSchema';
import { tagListSchema } from '../schemas/IListTagSchema';
import { tagDeleteSchema } from '../schemas/IDeleteTagSchema';

const tagsRouter = Router();
const tagController = new TagsController();

tagsRouter.use(isAuthenticated);

tagsRouter.get(
  '/:id',
  requestValidation(tagShowSchema),
  tagController.findById
);

tagsRouter.get('/', requestValidation(tagListSchema), tagController.list);

tagsRouter.post('/', requestValidation(tagCreateSchema), tagController.create);

tagsRouter.put(
  '/:id',
  requestValidation(tagUpdateSchema),
  tagController.update
);

tagsRouter.delete(
  '/:id',
  requestValidation(tagDeleteSchema),
  tagController.delete
);

export default tagsRouter;
