import AppError from '@shared/errors/AppError';
// import { getCustomRepository } from 'typeorm';
// import UserTokensRepository from '../infra/typeorm/repositories/UserTokensRepository';
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';
import { IResetPasswordUser } from '../domain/models/IResetPasswordUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { IUser } from '../domain/models/IUser';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('UsersTokensRepository')
    private readonly usersTokensRepository: IUserTokensRepository,
    @inject('LogProvider')
    private readonly logger: ILogProvider
  ) {}
  public async execute({
    token,
    password,
  }: IResetPasswordUser): Promise<IUser> {
    const userToken = await this.usersTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists.', 'ResetPasswordService');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists.', 'ResetPasswordService');
    }

    const TokenCreatedAt = userToken.created_at;
    const CompareDateExpires = addHours(TokenCreatedAt, 2);

    if (isAfter(new Date(), CompareDateExpires)) {
      throw new AppError('Token Expired.', 'ResetPasswordService');
    }
    const saltRounds = 8;
    const hashedPassword = await hash(password, saltRounds);

    user.password = hashedPassword;
    await this.usersRepository.save(user);

    this.logger.info({
      message: 'Password reset successfully',
      context: 'ResetPasswordService',
      metadata: { userId: user.id },
    });

    return user;
  }
}

export default ResetPasswordService;
