import { v4 as uuidv4 } from 'uuid';
import { ITagRepository } from '@modules/tags/domain/repositories/ITagRepository';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';
import { ICreateTag } from '@modules/tags/domain/models/ICreateTag';
import User from '@modules/users/infra/typeorm/entities/User';
import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';

class FakeTagsRepository implements ITagRepository {
  private tags: Tag[] = [];
  public async create({ name, userId }: ICreateTag): Promise<Tag> {
    const tag = new Tag();

    tag.id = uuidv4();
    tag.name = name;
    tag.userId = userId;
    tag.createdAt = new Date();

    const user = new User();
    user.id = userId;
    tag.user = user;

    this.tags.push(tag);

    return tag;
  }

  public async save(tag: Tag): Promise<Tag> {
    const findIndex = this.tags.findIndex((findUser) => findUser.id === tag.id);

    this.tags[findIndex] = tag;

    return tag;
  }

  public async remove(tag: Tag): Promise<void> {
    const findIndex = this.tags.findIndex((t) => t.id === tag.id);
    if (findIndex >= 0) {
      this.tags.splice(findIndex, 1);
    }
  }

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

  public async list(
    userId: string,
    perPage: number,
    currentPage: number
  ): Promise<IPaginationReturn<Tag[]>> {
    const filtered = this.tags.filter((t) => t.userId === userId);
    const start = (currentPage - 1) * perPage;
    const data = filtered.slice(start, start + perPage);
    return {
      perPage,
      currentPage,
      totalRows: filtered.length,
      data,
    };
  }

  public async findByName(
    name: string,
    userId: string
  ): Promise<Tag | undefined> {
    const tag = this.tags.find(
      (tag) => tag.name === name && tag.userId === userId
    );
    return tag;
  }

  public async findById(id: string): Promise<Tag | undefined> {
    const tag = this.tags.find((tag) => tag.id === id);
    return tag;
  }
}

export default FakeTagsRepository;
