import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import AppError from '@shared/errors/AppError';

@injectable()
class DeleteTagService {
  constructor(
    @inject('TagsRepository')
    private tagRepository: ITagRepository,
  ) { }

  public async execute(id: string): Promise<void> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new AppError('Tag not found.', 404);
    }

    await this.tagRepository.remove(tag);
  }
}

export default DeleteTagService;
