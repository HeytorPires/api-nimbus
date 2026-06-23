import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { UserDTO } from '../domain/dtos/UserDTO';
import UserMapper from '../mappers/userMapper';

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository
  ) {}

  private readonly userMapper = new UserMapper();
  public async execute(user_id: string): Promise<UserDTO> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 'ShowProfileService');
    }

    return this.userMapper.toDTO(user);
  }
}

export default ShowProfileService;
