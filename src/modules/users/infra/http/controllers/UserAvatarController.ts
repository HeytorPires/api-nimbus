import { Request, Response } from 'express';
import UpdateUserAvatarService from '../../../services/UpdateUserAvatarService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

export default class UserAvatarController {
  public async update(request: Request, response: Response) {
    const updateAvatar = container.resolve(UpdateUserAvatarService);

    const user = updateAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file?.filename as string,
    });

    response.json(instanceToInstance(user));
    return;
  }
}
