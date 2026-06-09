import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateTagService from '@modules/tags/services/UpdateTagService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let updateTag: UpdateTagService;

describe('UpdateTag', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    updateTag = new UpdateTagService(fakeTagsRepository);
  });

  it('should be able to update a tag', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const created = await fakeTagsRepository.create({
      name: 'Old Name',
      user_id: user.id,
    });

    const updatedTag = await updateTag.execute({
      id: created.id,
      name: 'New Name',
      user_id: user.id,
    });

    expect(updatedTag.name).toBe('New Name');
  });

  it('should not be able to update a non-existing tag', async () => {
    await expect(
      updateTag.execute({
        id: 'non-existing-id',
        name: 'New Name',
        user_id: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow updating tag from another user', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'User 2',
      email: 'user2@gmail.com',
      password: '123456',
    });

    const tag = await fakeTagsRepository.create({
      name: 'Tag from User 1',
      user_id: user1.id,
    });

    await expect(
      updateTag.execute({
        id: tag.id,
        name: 'Updated Name',
        user_id: user2.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
