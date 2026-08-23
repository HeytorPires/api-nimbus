import { Request, Response } from 'express';
import ShowProfileService from '../../../services/ShowProfileService';
import UpdateProfileService from '../../../services/UpdateProfileService';
import { container } from 'tsyringe';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const listUser = container.resolve(ShowProfileService);
    const userId = request.user.id;
    const user = await listUser.execute(userId);

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, password, oldPassword } = request.body;
    const UpdateUser = container.resolve(UpdateProfileService);

    const user = await UpdateUser.execute({
      userId,
      name,
      email,
      password,
      oldPassword,
    });

    return response.json(user);
  }
}
