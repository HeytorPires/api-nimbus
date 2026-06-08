import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import ProjectsController from '../controllers/ProjectsController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { projectCreateSchema } from '../schemas/ICreateProjectSchema';
import { projectUpdateSchema } from '../schemas/IUpdateProjectSchema';
import { projectShowSchema } from '../schemas/IShowProjectSchema';
import { projectListSchema } from '../schemas/IListProjectSchema';
import { projectDeleteSchema } from '../schemas/IDeleteProjectSchema';

const projectsRouter = Router();
const projectController = new ProjectsController();

projectsRouter.use(isAuthenticated);

projectsRouter.get(
  '/:id',
  requestValidation(projectShowSchema),
  projectController.findById
);
projectsRouter.get(
  '/',
  requestValidation(projectListSchema),
  projectController.list
);
projectsRouter.post(
  '/',
  requestValidation(projectCreateSchema),
  projectController.create
);
projectsRouter.put(
  '/:id',
  requestValidation(projectUpdateSchema),
  projectController.update
);
projectsRouter.delete(
  '/:id',
  requestValidation(projectDeleteSchema),
  projectController.delete
);

export default projectsRouter;
