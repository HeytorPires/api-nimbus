import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ShowTagService from '@modules/tags/services/ShowTagService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let showTagService: ShowTagService;

describe('Show Tag', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    showTagService = new ShowTagService(fakeTagsRepository);
  });

  it('deve ser capaz de exibir uma tag existente', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    const tag = await fakeTagsRepository.create({
      name: 'Infra',
      userId: user.id,
    });

    const response = await showTagService.execute(tag.id, user.id);

    expect(response).toMatchObject({
      id: tag.id,
      name: 'Infra',
      userId: user.id,
    });
  });

  it('não deve ser capaz de exibir uma tag que não existe', async () => {
    await expect(
      showTagService.execute('invalid-tag-id', 'user-id')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de exibir uma tag de outro usuário', async () => {
    const owner = await fakeUsersRepository.create({
      name: 'Owner',
      email: 'owner@example.com',
      password: '123456',
    });
    const anotherUser = await fakeUsersRepository.create({
      name: 'Another',
      email: 'another@example.com',
      password: '123456',
    });
    const tag = await fakeTagsRepository.create({
      name: 'Private',
      userId: owner.id,
    });

    await expect(
      showTagService.execute(tag.id, anotherUser.id)
    ).rejects.toBeInstanceOf(AppError);
  });
});
