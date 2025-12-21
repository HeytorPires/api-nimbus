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
    const hashToken: string = authConfig.jwt.secret!;
    // melhor seria a constante a baixo, mas a tipagem do projeto está zuada
    // const ExpiresTime: string | number = authConfig.jwt.expiresIn;
    const token = sign({}, hashToken, {
      subject: user.id,
      expiresIn: '1d',
    });
    return { user, token };
  }
}

export default CreateSessionsService;

