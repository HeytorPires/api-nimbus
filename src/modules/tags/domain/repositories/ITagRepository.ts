import { ICreateTag } from '../models/ICreateTag';
import { ITag } from '../models/ITag';
import User from '@modules/users/infra/typeorm/entities/User';

export interface ITagRepository {
  findByName(name: string, user: User): Promise<ITag | undefined>;
  findById(id: string): Promise<ITag | undefined>;
  list(userId: string): Promise<ITag[] | undefined>;
  create(data: ICreateTag): Promise<ITag>;
  update(tag: ITag): Promise<ITag | undefined>;
  save(tag: ITag): Promise<ITag>;
  remove(tag: ITag): Promise<void>;
}
