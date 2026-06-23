import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { UserDTO } from '../domain/dtos/UserDTO';
import UserMapper from '../mappers/userMapper';

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository
  ) {}

  private readonly userMapper = new UserMapper();
  public async execute(): Promise<UserDTO[]> {
    const users = await this.usersRepository.list();
    if (!users) return [];

    return this.userMapper.toDTOList(users);
  }
}

export default ListUserService;
