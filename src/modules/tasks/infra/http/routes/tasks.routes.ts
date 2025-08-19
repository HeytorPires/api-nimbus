import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import TasksController from '../controllers/TasksController';
import { taskCreateSchema } from '../schemas/ICreateTaskSchema';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';
import { taskUpdateSchema } from '../schemas/IUpdateTaskSchema';

const tasksRouter = Router();
const taskController = new TasksController();

tasksRouter.use(isAuthenticated)

tasksRouter.get('/:id', taskController.findById);


tasksRouter.get(
    '/',
    // requestValidation(taskCreateSchema),
    taskController.list
);
tasksRouter.post(
    '/',
    requestValidation(taskCreateSchema),
    taskController.create
);
tasksRouter.put(
    '/:id',
    requestValidation(taskUpdateSchema),
    taskController.update
);

tasksRouter.delete(
    '/:id',
    // requestValidation(taskCreateSchema),
    taskController.delete
);



export default tasksRouter;
