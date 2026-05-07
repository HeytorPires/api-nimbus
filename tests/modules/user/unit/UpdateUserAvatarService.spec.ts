import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('Update user avatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve ser capaz de atualizar o avatar do usuário', async () => {
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
    expect((await fakeUsersRepository.findById(user.id))?.avatar).toBe(
      'avatar.jpg'
    );
  });

  it('deve remover o avatar antigo ao atualizar por um novo', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    user.avatar = 'old-avatar.jpg';
    await fakeUsersRepository.save(user);

    const statSpy = jest
      .spyOn(fs.promises, 'stat')
      .mockResolvedValue({} as fs.Stats);
    const unlinkSpy = jest
      .spyOn(fs.promises, 'unlink')
      .mockResolvedValue(undefined);

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'new-avatar.jpg',
    });

    const oldAvatarFilePath = path.join(
      uploadConfig.directory,
      'old-avatar.jpg'
    );

    expect(statSpy).toHaveBeenCalledWith(oldAvatarFilePath);
    expect(unlinkSpy).toHaveBeenCalledWith(oldAvatarFilePath);
    expect((await fakeUsersRepository.findById(user.id))?.avatar).toBe(
      'new-avatar.jpg'
    );
  });

  it('não deve ser capaz de atualizar o avatar de um usuário inexistente', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'user-does-not-exist',
        avatarFileName: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
