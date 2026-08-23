import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import AppError from '@shared/errors/AppError';
import { TagMapper } from '../mapper/TagMapper';
import { ITagDTO } from '../dtos/ITagDTO';
import { IUpdateTag } from '../domain/models/IUpdateTag';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { requestContext } from '@config/context';

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

  public async execute({ id, name, userId }: IUpdateTag): Promise<ITagDTO> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new AppError('Tag not found.', 'UpdateTagService', 404);
    }

    if (tag.user.id !== userId) {
      throw new AppError('Access denied.', 'UpdateTagService', 403);
    }

    const tagsExistsByName = await this.tagRepository.findByName(name, userId);

    if (tagsExistsByName && tagsExistsByName.id !== id) {
      throw new AppError('Tag name already in use.', 'UpdateTagService', 400);
    }

    tag.name = name;

    await this.tagRepository.save(tag);

    const context = requestContext.getStore();

    this.logger.info({
      message: 'Tag updated',
      context: 'UpdateTagService',
      metadata: { tagId: id, userId: userId },
      requestId: context?.requestId,
      requestIp: context?.requestIp,
    });

    return this.tagMapper.toDTO(tag);
  }
}

export default UpdateTagService;
