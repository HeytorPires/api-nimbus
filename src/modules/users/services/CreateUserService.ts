import AppError from '@shared/errors/AppError';
import { ICreateUser } from '../domain/models/ICreateUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import UserMapper from '../mappers/userMapper';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('HashProvider')
    private readonly hashProvider: IHashProvider
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

    return this.userMapper.toDTO(user);
  }
}

export default CreateUserService;
