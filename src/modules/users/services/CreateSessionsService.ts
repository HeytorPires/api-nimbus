import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import {
  IRequestCreateSession,
  IResponseCreateSession,
} from '../domain/models/ICreateSessions';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';

@injectable()
class CreateSessionsService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
    @inject('LogProvider')
    private readonly logger: ILogProvider
  ) {}
  public async execute({
    email,
    password,
  }: IRequestCreateSession): Promise<IResponseCreateSession> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        'Incorrect email/password combination.',
        'CreateSessionsService',
        401
      );
    }
    const hashedPassword = user.password;
    const isPasswordCorrect = await this.hashProvider.compareHash(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new AppError(
        'Incorrect email/password combination.',
        'CreateSessionsService',
        401
      );
    }
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });
    this.logger.info({
      message: 'Session created',
      context: 'CreateSessionsService',
      metadata: { email: user.email, userId: user.id },
      requestIp: 'N/A',
    });
    return { user, token };
  }
}

export default CreateSessionsService;
