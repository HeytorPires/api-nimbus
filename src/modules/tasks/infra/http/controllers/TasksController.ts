import { Request, Response } from 'express';
import ListTaskService from '@modules/tasks/services/ListTaskService';
import ShowTaskService from '@modules/tasks/services/ShowTaskService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import CreateTaskService from '@modules/tasks/services/CreateTaskService';
import DeleteTaskService from '@modules/tasks/services/DeleteTaskService';
import UpdateTaskService from '@modules/tasks/services/UpdateTaskService';

export default class TasksController {
  public async create(request: Request, response: Response) {
    const { title, description, variablesEnvironment, tagId } = request.body;
    const userId = request.user.id
    const createtasks = container.resolve(CreateTaskService);
    const task = await createtasks.execute({ title, description, variablesEnvironment, userId, tagId });

    response.json(instanceToInstance(task));
    return;
  }
  public async list(request: Request, response: Response) {
    const listTasks = container.resolve(ListTaskService);
    const userId = request.user.id
    const tasks = await listTasks.execute(userId);

    response.json(instanceToInstance(tasks));
    return;
  }
  public async findById(request: Request, response: Response) {
    const findTask = container.resolve(ShowTaskService);
    const { id } = request.params
    const userId = request.user.id
    const task = await findTask.execute(id, userId);

    response.json(instanceToInstance(task));
    return;
  }
  // public async findByName(request: Request, response: Response) {
  //     const listUser = container.resolve();
  //     const { name } = request.params
  //     const users = await listUser.execute(name);

  //     response.json(instanceToInstance(users));
  //     return;
  // }
  public async delete(request: Request, response: Response) {
    const deleteTask = container.resolve(DeleteTaskService);
    const { id } = request.params

    await deleteTask.execute(id)

    response.status(201);
    return;
  }
  public async update(request: Request, response: Response) {
    const listUser = container.resolve(UpdateTaskService);
    const { id } = request.params
    const { title, description, variablesEnvironment, tagId } = request.body
    const userId = request.user.id
    const task = await listUser.execute({ id, title, description, variablesEnvironment, userId, tagId });

    response.status(200).json(instanceToInstance(task));
    return;
  }

}
