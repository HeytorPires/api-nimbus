import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import {
  IRequestCreateSession,
  IResponseCreateSession,
} from '../domain/models/ICreateSessions';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';

@injectable()
class CreateSessionsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}
  public async execute({
    email,
    password,
  }: IRequestCreateSession): Promise<IResponseCreateSession> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }
    const hashedPassword = user.password;
    const isPasswordCorrect = await this.hashProvider.compareHash(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new AppError('Incorrect email/password combination.', 401);
    }
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });
    return { user, token };
  }
}

export default CreateSessionsService;
