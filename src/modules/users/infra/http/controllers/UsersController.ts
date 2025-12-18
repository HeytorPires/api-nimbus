import { Request, Response } from 'express';
import ListUserService from '../../../services/ListUserService';
import CreateUserService from '../../../services/CreateUserService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class UsersController {
  public async index(request: Request, response: Response) {
    const listUser = container.resolve(ListUserService);
    const users = await listUser.execute();

    response.json(instanceToInstance(users));
    return;
  }

  public async create(request: Request, response: Response) {
    const { name, email, password } = request.body;
    const createUsers = container.resolve(CreateUserService);
    ('');
    const user = await createUsers.execute({ name, email, password });

    response.json(instanceToInstance(user));
    return;
  }

  public async getUser(request: Request, response: Response) {
    const userId = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute(userId);

    response.json(instanceToInstance(user));
    return;
  }
}

