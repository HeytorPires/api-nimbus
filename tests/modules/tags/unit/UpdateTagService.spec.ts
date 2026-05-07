import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateTagService from '@modules/tags/services/UpdateTagService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let updateTagService: UpdateTagService;

describe('Update Tag', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    updateTagService = new UpdateTagService(fakeTagsRepository);
  });

  it('deve ser capaz de atualizar uma tag existente', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    const tag = await fakeTagsRepository.create({
      name: 'Infra',
      userId: user.id,
    });

    const updatedTag = await updateTagService.execute({
      id: tag.id,
      name: 'Backend',
      userId: user.id,
    });

    expect(updatedTag).toMatchObject({
      id: tag.id,
      name: 'Backend',
      userId: user.id,
    });

    const storedTag = await fakeTagsRepository.findById(tag.id);

    expect(storedTag?.name).toBe('Backend');
  });

  it('não deve ser capaz de atualizar uma tag que não existe', async () => {
    await expect(
      updateTagService.execute({
        id: 'invalid-tag-id',
        name: 'Backend',
        userId: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de atualizar uma tag de outro usuário', async () => {
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
      name: 'Infra',
      userId: owner.id,
    });

    await expect(
      updateTagService.execute({
        id: tag.id,
        name: 'Backend',
        userId: anotherUser.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
