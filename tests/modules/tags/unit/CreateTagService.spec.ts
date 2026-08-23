import CreateTagService from '@modules/tags/services/CreateTagService';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../../../modules/user/repositories/FakeUsersRepository';
import FakeTagsRepository from '../repositories/FakeTagsRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createTagService: CreateTagService;

describe('Create Tag', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createTagService = new CreateTagService(
      fakeTagsRepository,
      fakeUsersRepository
    );
  });

  it('should be able to create a new Tag', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    const tag = await createTagService.execute({
      name: 'Important',
      userId: user.id,
    });

    expect(tag).toHaveProperty('id');
  });
  it('should not be able to create two tags with the same name', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    await createTagService.execute({
      name: 'Important',
      userId: user.id,
    });
    await expect(
      createTagService.execute({
        name: 'Important',
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create tags with invalid userId', async () => {
    await expect(
      createTagService.execute({
        name: 'Important',
        userId: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
