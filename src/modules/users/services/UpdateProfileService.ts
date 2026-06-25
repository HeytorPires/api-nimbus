import AppError from '@shared/errors/AppError';
import { IUpdateProfileUser } from '../domain/models/IUpdateProfileUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import { UserDTO } from '../domain/dtos/UserDTO';
import UserMapper from '../mappers/userMapper';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
    @inject('LogProvider')
    private readonly logger: ILogProvider
  ) {}

  private readonly userMapper = new UserMapper();
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfileUser): Promise<UserDTO> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 'UpdateProfileService');
    }

    const userUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new AppError(
        'there is already one user with this email',
        'UpdateProfileService'
      );
    }

    if (password && !old_password) {
      throw new AppError('Old password is required', 'UpdateProfileService');
    }
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );
      if (!checkOldPassword) {
        throw new AppError(
          'Old password does not match.',
          'UpdateProfileService'
        );
      }

      //   const saltRounds = 8;
      user.password = await this.hashProvider.generateHash(password);
    }
    user.email = email;
    user.name = name;

    await this.usersRepository.save(user);

    this.logger.info({
      message: 'Profile updated',
      context: 'UpdateProfileService',
      metadata: { userId: user_id },
    });

    return this.userMapper.toDTO(user);
  }
}

export default UpdateProfileService;
