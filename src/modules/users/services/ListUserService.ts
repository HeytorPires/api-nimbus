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
  public async execute(): Promise<UserDTO[]> {
    const users = await this.usersRepository.list();

    return users ? UserMapper.toDTOList(users) : [];
  }
}

export default ListUserService;
