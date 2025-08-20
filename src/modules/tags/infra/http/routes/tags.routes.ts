import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import TagsController from '../controllers/TagsController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { tagCreateSchema } from '../schemas/ICreateTagSchema';
import { tagUpdateSchema } from '../schemas/IUpdateTagSchema';

const tagsRouter = Router();
const tagController = new TagsController();

tagsRouter.use(isAuthenticated);

tagsRouter.get('/:id', tagController.findById);
tagsRouter.get('/', tagController.list);
tagsRouter.post('/', requestValidation(tagCreateSchema), tagController.create);
tagsRouter.put('/:id', requestValidation(tagUpdateSchema), tagController.update);
tagsRouter.delete('/:id', tagController.delete);

export default tagsRouter;
