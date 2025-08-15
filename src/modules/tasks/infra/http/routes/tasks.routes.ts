import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middleware/isAuthenticated';
import TasksController from '../controllers/TasksController';
import { taskCreateSchema } from '../schemas/ICreateTaskSchema';
import { requestValidation } from '@shared/infra/http/middleware/requestValidation';

const usersRouter = Router();
const taskController = new TasksController();

usersRouter.use(isAuthenticated)

// usersRouter.get('/', taskController.index);
usersRouter.post(
    '/',
    requestValidation(taskCreateSchema),
    taskController.create
);



export default usersRouter;
