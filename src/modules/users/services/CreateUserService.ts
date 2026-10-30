import AppError from '@shared/errors/AppError';
import { ICreateUser } from '../domain/models/ICreateUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import UserMapper from '../mappers/userMapper';
import SendWelcomeEmailService from './SendWelcomeEmailService';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
    @inject('LogProvider')
    private readonly logger: ILogProvider,
    private readonly sendWelcomeEmail: SendWelcomeEmailService
  ) {}

  private readonly userMapper = new UserMapper();

  public async execute({ name, email, password }: ICreateUser) {
    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.', 'CreateUserService');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // o cadastro já foi concluído: falha no envio não pode derrubá-lo
    try {
      await this.sendWelcomeEmail.execute({
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      const { message } = error as { message?: string };
      this.logger.error({
        message: `Failed to send welcome email: ${message}`,
        context: 'CreateUserService',
        metadata: { userId: user.id },
      });
    }

    return this.userMapper.toDTO(user);
  }
}

export default CreateUserService;
