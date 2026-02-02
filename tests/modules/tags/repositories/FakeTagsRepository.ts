import { v4 as uuidv4 } from 'uuid';
import { ITagRepository } from '@modules/tags/domain/repositories/ITagRepository';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';
import { ICreateTag } from '@modules/tags/domain/models/ICreateTag';

class FakeTagsRepository implements ITagRepository {
  private tags: Tag[] = [];
  public async create({ name, userId }: ICreateTag): Promise<Tag> {
    const tag = new Tag();

    tag.id = uuidv4();
    tag.name = name;
    tag.userId = userId;
    tag.created_at = new Date();

    this.tags.push(tag);

    return tag;
  }

  public async save(tag: Tag): Promise<Tag> {
    const findIndex = this.tags.findIndex((findUser) => findUser.id === tag.id);

    this.tags[findIndex] = tag;

    return tag;
  }

  public async remove(tag: Tag): Promise<void> {}

  public async findAll(): Promise<Tag[]> {
    return this.tags;
  }

  public async update(tag: Tag): Promise<Tag | undefined> {
    const findIndex = this.tags.findIndex((findTag) => findTag.id === tag.id);

    if (findIndex === -1) {
      return undefined;
    }

    this.tags[findIndex] = tag;

    return tag;
  }

  public async list(): Promise<Tag[] | undefined> {
    return this.tags;
  }

  public async findByName(name: string): Promise<Tag | undefined> {
    const tag = this.tags.find((tag) => tag.name === name);
    return tag;
  }

  public async findById(id: string): Promise<Tag | undefined> {
    const tag = this.tags.find((tag) => tag.id === id);
    return tag;
  }
}

export default FakeTagsRepository;

