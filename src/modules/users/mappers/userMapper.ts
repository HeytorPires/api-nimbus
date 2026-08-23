import { container } from 'tsyringe';
import { IUser } from '@modules/users/domain/models/IUser';
import { UserDTO } from '@modules/users/domain/dtos/UserDTO';
import { IStorageProvider } from '@shared/providers/storage/models/IStorageProvider';

export default class UserMapper {
  private readonly storageProvider: IStorageProvider;

  constructor() {
    this.storageProvider =
      container.resolve<IStorageProvider>('StorageProvider');
  }

  async toDTO(user: IUser): Promise<UserDTO> {
    const avatarUrl = user.avatar
      ? await this.storageProvider.getFileUrl(user.avatar)
      : null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async toDTOList(users: IUser[]): Promise<UserDTO[]> {
    return Promise.all(users.map((user) => this.toDTO(user)));
  }
}
