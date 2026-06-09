import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ShowTagService from '@modules/tags/services/ShowTagService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let showTag: ShowTagService;

describe('ShowTag', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    showTag = new ShowTagService(fakeTagsRepository);
  });

  it('should be able to show a tag', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const created = await fakeTagsRepository.create({
      name: 'Important',
      user_id: user.id,
    });

    const tag = await showTag.execute(created.id, user.id);

    expect(tag).toHaveProperty('id');
    expect(tag.name).toBe('Important');
    expect(tag.user_id).toBe(user.id);
  });

  it('should not be able to show a non-existing tag', async () => {
    await expect(
      showTag.execute('non-existing-id', 'user-id')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow access to tag from another user', async () => {
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
      name: 'Private Tag',
      user_id: user1.id,
    });

    await expect(showTag.execute(tag.id, user2.id)).rejects.toBeInstanceOf(
      AppError
    );
  });
});
