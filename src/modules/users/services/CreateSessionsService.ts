import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
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
import { IJWTProvider } from '@shared/providers/jwt/models/IJWTProvider';

@injectable()
class CreateSessionsService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('UsersTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
    @inject('JWTProvider')
    private readonly jwtProvider: IJWTProvider,
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
    const jti = uuidv4();

    const accessToken = this.jwtProvider.sign({ jti }, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    const refreshToken = this.jwtProvider.sign(
      { jti },
      authConfig.refreshToken.secret,
      {
        subject: user.id,
        expiresIn: authConfig.refreshToken.expiresIn,
      }
    );

    await this.cacheProvider.save(
      `session:${user.id}`,
      jti,
      authConfig.refreshToken.expiresInSeconds
    );
    await this.userTokensRepository.save({ user_id: user.id, token: jti });

    this.logger.info({
      message: 'Session created',
      context: 'CreateSessionsService',
      metadata: { email: user.email, userId: user.id },
      requestIp: 'N/A',
    });
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
}

export default CreateSessionsService;
