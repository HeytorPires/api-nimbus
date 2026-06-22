import { inject, injectable } from 'tsyringe';
import { ICacheProvider } from '@shared/providers/cache/models/ICacheProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';

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

  public async execute(user_id: string): Promise<void> {
    const jti = await this.cacheProvider.recover<string>(`session:${user_id}`);
    await this.cacheProvider.invalidate(`session:${user_id}`);

    if (jti) {
      await this.usersTokensRepository.deleteByToken(jti);
    }

    this.logger.info({
      message: 'Session destroyed',
      context: 'LogoutService',
      metadata: { userId: user_id },
      requestIp: 'N/A',
    });
  }
}

export default LogoutService;
