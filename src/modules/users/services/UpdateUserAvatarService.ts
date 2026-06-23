import AppError from '@shared/errors/AppError';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { UserDTO } from '../domain/dtos/UserDTO';
import UserMapper from '../mappers/userMapper';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository
  ) {}
  public async execute({
    user_id,
    avatarFileName,
  }: IUpdateUserAvatar): Promise<UserDTO> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found!', 'UpdateUserAvatarService');
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFileName;

    await this.usersRepository.save(user);

    return UserMapper.toDTO(user);
  }
}

export default UpdateUserAvatarService;
