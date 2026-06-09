import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import { TagMapper } from '../mapper/TagMapper';
import { ITagDTO } from '../dtos/ITagDTO';
import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';

@injectable()
class ListTagService {
  private readonly tagMapper: TagMapper;

  constructor(
    @inject('TagsRepository')
    private readonly tagRepository: ITagRepository
  ) {
    this.tagMapper = new TagMapper();
  }

  public async execute(
    user_id: string,
    perPage: number,
    currentPage: number
  ): Promise<IPaginationReturn<ITagDTO[]>> {
    const tags = await this.tagRepository.list(user_id, perPage, currentPage);

    return {
      ...tags,
      data: this.tagMapper.toDTOList(tags.data),
    };
  }
}

export default ListTagService;
