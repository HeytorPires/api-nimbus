import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import AppError from '@shared/errors/AppError';
import { TagMapper } from '../mapper/TagMapper';
import { ITagDTO } from '../dtos/ITagDTO';
import { IUpdateTag } from '../domain/models/IUpdateTag';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';

@injectable()
class UpdateTagService {
  private readonly tagMapper: TagMapper;

  constructor(
    @inject('TagsRepository')
    private readonly tagRepository: ITagRepository,
    @inject('LogProvider')
    private readonly logger: ILogProvider
  ) {
    this.tagMapper = new TagMapper();
  }

  public async execute({ id, name, user_id }: IUpdateTag): Promise<ITagDTO> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new AppError('Tag not found.', 'UpdateTagService', 404);
    }

    if (tag.user.id !== user_id) {
      throw new AppError('Access denied.', 'UpdateTagService', 403);
    }

    tag.name = name;

    await this.tagRepository.save(tag);

    this.logger.info({
      message: 'Tag updated',
      context: 'UpdateTagService',
      metadata: { tagId: id, userId: user_id },
    });

    return this.tagMapper.toDTO(tag);
  }
}

export default UpdateTagService;
