import AppError from '@shared/errors/AppError';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IStorageProvider } from '@shared/providers/storage/models/IStorageProvider';
import { UserDTO } from '../domain/dtos/UserDTO';
import UserMapper from '../mappers/userMapper';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider
  ) {}

  private readonly userMapper = new UserMapper();
  public async execute({
    user_id,
    avatarFileName,
  }: IUpdateUserAvatar): Promise<UserDTO> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found!', 'UpdateUserAvatarService');
    }
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const savedFile = await this.storageProvider.saveFile(avatarFileName);
    user.avatar = savedFile;

    await this.usersRepository.save(user);

    return this.userMapper.toDTO(user);
  }
}

export default UpdateUserAvatarService;
