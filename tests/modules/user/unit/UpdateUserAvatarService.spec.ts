import 'reflect-metadata';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeStorageProvider from '../../../providers/fakes/FakeStorageProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    container.registerInstance('StorageProvider', fakeStorageProvider);
    fakeUsersRepository = new FakeUsersRepository();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
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

    expect(updatedUser.avatar_url).toContain('avatar.jpg');
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

    expect(updatedUser.avatar_url).toContain('new-avatar.jpg');
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
