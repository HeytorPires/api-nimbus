import { IUser } from '@modules/users/domain/models/IUser';
import { UserDTO } from '@modules/users/domain/dtos/UserDTO';

export default class UserMapper {
  private static buildAvatarUrl(avatar: string | null): string | null {
    if (!avatar) return null;
    return `${process.env.APP_API_URL}/files/${avatar}`;
  }

  static toDTO(user: IUser): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: UserMapper.buildAvatarUrl(user.avatar),
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  static toDTOList(users: IUser[]): UserDTO[] {
    return users.map(UserMapper.toDTO);
  }
}
