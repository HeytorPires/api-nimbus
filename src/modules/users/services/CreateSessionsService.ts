import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import authConfig from '@config/auth';
import {
  IRequestCreateSession,
  IResponseCreateSession,
} from '../domain/models/ICreateSessions';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { ICacheProvider } from '@shared/providers/cache/models/ICacheProvider';
import UserMapper from '../mappers/userMapper';

const SESSION_TTL = 86400; // 1 day in seconds

@injectable()
class CreateSessionsService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('UsersTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
    @inject('LogProvider')
    private readonly logger: ILogProvider,
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider
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
    const jti = uuidv4();

    const token = sign({ jti }, secret, {
      subject: user.id,
      expiresIn,
    });

    await this.cacheProvider.save(`session:${user.id}`, jti, SESSION_TTL);
    await this.userTokensRepository.save({ user_id: user.id, token: jti });

    this.logger.info({
      message: 'Session created',
      context: 'CreateSessionsService',
      metadata: { email: user.email, userId: user.id },
      requestIp: 'N/A',
    });
    return { user: UserMapper.toDTO(user), token };
  }
}

export default CreateSessionsService;
