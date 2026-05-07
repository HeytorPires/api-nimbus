import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import DeleteTagService from '@modules/tags/services/DeleteTagService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let deleteTagService: DeleteTagService;

describe('Delete Tag', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    deleteTagService = new DeleteTagService(fakeTagsRepository);
  });

  it('deve ser capaz de excluir uma tag existente', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    const tag = await fakeTagsRepository.create({
      name: 'Infra',
      userId: user.id,
    });

    await deleteTagService.execute(tag.id);

    const deletedTag = await fakeTagsRepository.findById(tag.id);

    expect(deletedTag).toBeUndefined();
  });

  it('não deve ser capaz de excluir uma tag que não existe', async () => {
    await expect(
      deleteTagService.execute('invalid-tag-id')
    ).rejects.toBeInstanceOf(AppError);
  });
});
