import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { getConnection } from 'typeorm';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { ICacheProvider } from '@shared/providers/cache/models/ICacheProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { IJWTProvider } from '@shared/providers/jwt/models/IJWTProvider';
import UserToken from '../infra/typeorm/entities/UserToken';

interface ITokenPayload {
  sub: string;
  jti: string;
}

interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@injectable()
class RefreshTokenService {
  constructor(
    @inject('UsersTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
    @inject('JWTProvider')
    private readonly jwtProvider: IJWTProvider,
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
    @inject('LogProvider')
    private readonly logger: ILogProvider
  ) {}

  public async execute(
    currentRefreshToken: string
  ): Promise<IRefreshTokenResponse> {
    const { secret, expiresIn, expiresInSeconds } = authConfig.refreshToken;

    let payload: ITokenPayload;

    try {
      const decoded = this.jwtProvider.verify(currentRefreshToken, secret);
      payload = decoded as ITokenPayload;
    } catch {
      throw new AppError('Invalid refresh token', 'RefreshTokenService', 401);
    }

    const { sub: userId, jti } = payload;

    const storedToken = await this.cacheProvider.recover<string>(
      `session:${userId}`
    );

    if (!storedToken) {
      const dbToken = await this.userTokensRepository.findByUserId(userId);

      if (!dbToken?.token || dbToken.token !== jti) {
        throw new AppError('Refresh token revoked', 'RefreshTokenService', 401);
      }
    } else if (storedToken !== jti) {
      throw new AppError('Refresh token revoked', 'RefreshTokenService', 401);
    }

    // ✅ PASSO 1: Gerar novos tokens PRIMEIRO
    const newJti = uuidv4();

    const accessToken = this.jwtProvider.sign(
      { jti: newJti },
      authConfig.jwt.secret,
      {
        subject: userId,
        expiresIn: authConfig.jwt.expiresIn,
      }
    );

    const refreshToken = this.jwtProvider.sign({ jti: newJti }, secret, {
      subject: userId,
      expiresIn,
    });

    // ✅ PASSO 2: Persistir novos tokens (com transaction na camada de serviço)
    const connection = getConnection();
    await connection.transaction(async (transactionEntityManager) => {
      // Remove old token
      await transactionEntityManager.delete(UserToken, { user_id: userId });

      // Save new token
      const userToken = transactionEntityManager.create(UserToken, {
        user_id: userId,
        token: newJti,
      });

      await transactionEntityManager.save(UserToken, userToken);
    });

    // ✅ PASSO 3: Atualizar cache
    await this.cacheProvider.invalidate(`session:${userId}`);
    await this.cacheProvider.save(
      `session:${userId}`,
      newJti,
      expiresInSeconds
    );

    this.logger.info({
      message: 'Token refreshed',
      context: 'RefreshTokenService',
      metadata: { userId },
    });

    return { accessToken, refreshToken };
  }
}

export default RefreshTokenService;
