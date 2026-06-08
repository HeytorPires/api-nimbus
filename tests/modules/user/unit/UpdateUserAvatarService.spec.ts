import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatarService;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;

// Mock fs module
jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  promises: {
    stat: jest.fn().mockResolvedValue(true),
    unlink: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository);
    createUser = new CreateUserService(fakeUsersRepository, hashProvider);
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should delete old avatar when updating new one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    user.avatar = 'old-avatar.jpg';
    await fakeUsersRepository.save(user);

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'new-avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('new-avatar.jpg');
  });

  it('should not be able to update avatar of non-existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-id',
        avatarFileName: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
