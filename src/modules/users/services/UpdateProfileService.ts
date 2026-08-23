import AppError from '@shared/errors/AppError';
import { IUpdateProfileUser } from '../domain/models/IUpdateProfileUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import { UserDTO } from '../domain/dtos/UserDTO';
import UserMapper from '../mappers/userMapper';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { requestContext } from '@config/context';

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
    userId,
    name,
    email,
    password,
    oldPassword,
  }: IUpdateProfileUser): Promise<UserDTO> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 'UpdateProfileService');
    }

    const userUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id !== userId) {
      throw new AppError(
        'there is already one user with this email',
        'UpdateProfileService'
      );
    }

    if (password && !oldPassword) {
      throw new AppError('Old password is required', 'UpdateProfileService');
    }
    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
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

    const context = requestContext.getStore();

    this.logger.info({
      message: 'Profile updated',
      context: 'UpdateProfileService',
      metadata: { userId: userId },
      requestId: context?.requestId,
      requestIp: context?.requestIp,
    });

    return this.userMapper.toDTO(user);
  }
}

export default UpdateProfileService;
