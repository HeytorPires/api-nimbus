import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import ProjectsController from '../controllers/ProjectsController';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { projectCreateSchema } from '../schemas/ICreateProjectSchema';
import { projectUpdateSchema } from '../schemas/IUpdateProjectSchema';

const projectsRouter = Router();
const projectController = new ProjectsController();

projectsRouter.use(isAuthenticated);

projectsRouter.get('/:id', projectController.findById);
projectsRouter.get('/', projectController.list);
projectsRouter.post('/', requestValidation(projectCreateSchema), projectController.create);
projectsRouter.put('/:id', requestValidation(projectUpdateSchema), projectController.update);
projectsRouter.delete('/:id', projectController.delete);

export default projectsRouter;
