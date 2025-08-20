import User from '@modules/users/infra/typeorm/entities/User';
import { UserDTO } from '@modules/users/domain/dtos/UserDTO';

export default class UserMapper {
  // Converte Entity -> DTO
  static toDTO(user: User): UserDTO {
    return {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  // Converte DTO -> Entity
  static toEntity(dto: UserDTO): User {
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.avatar = dto.avatar;
    user.created_at = dto.created_at;
    user.updated_at = dto.updated_at;
    return user;
  }
}
