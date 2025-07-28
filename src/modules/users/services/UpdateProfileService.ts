import AppError from '@shared/errors/AppError';
import bcrypt from 'bcryptjs';
import { IUpdateProfileUser } from '../domain/models/IUpdateProfileUser';
import { IUser } from '../domain/models/IUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository
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

    if (password && old_password) {
      const checkOldPassoword = await bcrypt.compare(
        old_password,
        user.password
      );
      if (!checkOldPassoword) {
        throw new AppError('Old password does not match.');
      }

      const saltRounds = 8;
      user.password = await bcrypt.hash(password, saltRounds);
    }
    user.email = email;
    user.name = name;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
