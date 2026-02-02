import AppError from '@shared/errors/AppError';
import { IUpdateProfileUser } from '../domain/models/IUpdateProfileUser';
import { IUser } from '../domain/models/IUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfileUser): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new AppError('there is already one user with this email');
    }

    if (password && !old_password) {
      throw new AppError('Old password is required');
    }
    console.log('Password:', password, 'Old password:', old_password);
    if (password && old_password) {
      console.log('Old password input:', old_password);
      console.log('User password hash:', user.password);
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );
      console.log('Password match:', checkOldPassword);
      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      const saltRounds = 8;
      user.password = await this.hashProvider.generateHash(password);
    }
    user.email = email;
    user.name = name;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;

