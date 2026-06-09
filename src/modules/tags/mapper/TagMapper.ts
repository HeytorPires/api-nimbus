import { ITagDTO } from '../dtos/ITagDTO';
import { ITag } from '../domain/models/ITag';

export class TagMapper {
  toDTO(tag: ITag): ITagDTO {
    return {
      id: tag.id,
      name: tag.name,
      created_at: tag.created_at,
      user_id: tag.user_id,
    };
  }

  toDTOList(tags: ITag[]): ITagDTO[] {
    return tags.map((tag) => this.toDTO(tag));
  }
}
