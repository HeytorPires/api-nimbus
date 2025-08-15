import { Request, Response } from 'express';
import ListUserService from '../../../services/ListUserService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import CreateTaskService from '@modules/tasks/services/CreateTaskService';

export default class TasksController {
    public async create(request: Request, response: Response) {
        const { title, description, variablesEnvironment, userId } = request.body;
        const createtasks = container.resolve(CreateTaskService);
        const user = await createtasks.execute({ title, description, variablesEnvironment, userId });

        response.json(instanceToInstance(user));
        return;
    }
    public async list(request: Request, response: Response) {
        const listUser = container.resolve(ListUserService);
        const users = await listUser.execute();

        response.json(instanceToInstance(users));
        return;
    }
    public async findById(request: Request, response: Response) {
        const listUser = container.resolve(ListUserService);
        const users = await listUser.execute();

        response.json(instanceToInstance(users));
        return;
    }
    public async findByName(request: Request, response: Response) {
        const listUser = container.resolve(ListUserService);
        const users = await listUser.execute();

        response.json(instanceToInstance(users));
        return;
    }
    public async delete(request: Request, response: Response) {
        const listUser = container.resolve(ListUserService);
        const users = await listUser.execute();

        response.json(instanceToInstance(users));
        return;
    }
    public async update(request: Request, response: Response) {
        const listUser = container.resolve(ListUserService);
        const users = await listUser.execute();

        response.json(instanceToInstance(users));
        return;
    }

}
