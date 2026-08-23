import { inject, injectable } from 'tsyringe';
import { ICacheProvider } from '@shared/providers/cache/models/ICacheProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { requestContext } from '@config/context';

@injectable()
class LogoutService {
  constructor(
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
    @inject('UsersTokensRepository')
    private readonly usersTokensRepository: IUserTokensRepository,
    @inject('LogProvider')
    private readonly logger: ILogProvider
  ) {}

  public async execute(userId: string): Promise<void> {
    const jti = await this.cacheProvider.recover<string>(`session:${userId}`);
    await this.cacheProvider.invalidate(`session:${userId}`);

    if (jti) {
      await this.usersTokensRepository.deleteByToken(jti);
    }

    const context = requestContext.getStore();

    this.logger.info({
      requestId: context?.requestId,
      requestIp: context?.requestIp,
      message: 'Session destroyed',
      context: 'LogoutService',
      metadata: { userId: userId },
    });
  }
}

export default LogoutService;
